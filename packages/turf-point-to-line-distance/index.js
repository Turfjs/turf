// (logic of computation inspired by:
// https://stackoverflow.com/questions/32771458/distance-from-lat-lng-point-to-minor-arc-segment)

import bearing from '@turf/bearing';
import distance from '@turf/distance';
import rhumbBearing from '@turf/rhumb-bearing';
import rhumbDistance from '@turf/rhumb-distance';
import { toMercator, toWgs84 } from '@turf/projection';
import { featureOf } from '@turf/invariant';
import { segmentEach } from '@turf/meta';
import {
    point,
    feature,
    lineString,
    bearingToAzimuth,
    degreesToRadians,
    convertLength,
    isObject
} from '@turf/helpers';

/**
 * Returns the minimum distance between a {@link Point} and a {@link LineString}, being the distance from a line the
 * minimum distance between the point and any segment of the `LineString`.
 *
 * @name pointToLineDistance
 * @param {Coord} pt Feature or Geometry
 * @param {Feature<LineString>} line GeoJSON Feature or Geometry
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.units='kilometers'] can be degrees, radians, miles, or kilometers
 * @param {boolean} [options.mercator=false] if distance should be on Mercator or WGS84 projection
 * @returns {number} distance between point and line
 * @example
 * var pt = turf.point([0, 0]);
 * var line = turf.lineString([[1, 1],[-1, 1]]);
 *
 * var distance = turf.pointToLineDistance(pt, line, {units: 'miles'});
 * //=69.11854715938406
 */
function pointToLineDistance(pt, line, options) {
    // Optional parameters
    options = options || {};
    if (!isObject(options)) throw new Error('options is invalid');

    // validation
    if (!pt) throw new Error('pt is required');
    if (Array.isArray(pt)) pt = point(pt);
    else if (pt.type === 'Point') pt = feature(pt);
    else featureOf(pt, 'Point', 'point');

    if (!line) throw new Error('line is required');
    if (Array.isArray(line)) line = lineString(line);
    else if (line.type === 'LineString') line = feature(line);
    else featureOf(line, 'LineString', 'line');

    var distance = Infinity;
    var p = pt.geometry.coordinates;
    segmentEach(line, function (segment) {
        var a = segment.geometry.coordinates[0];
        var b = segment.geometry.coordinates[1];
        var d = distanceToSegment(p, a, b, options);
        if (distance > d) distance = d;
    });
    return distance;
}


/**
 * Returns the distance between a point P on a segment AB.
 *
 * @private
 * @param {Array<number>} p external point
 * @param {Array<number>} a first segment point
 * @param {Array<number>} b second segment point
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.units='kilometers'] can be degrees, radians, miles, or kilometers
 * @param {boolean} [options.mercator=false] if distance should be on Mercator or WGS84 projection
 * @returns {number} distance
 */
function distanceToSegment(p, a, b, options) {
    var mercator = options.mercator;
    var distanceAP = (mercator !== true) ? distance(a, p, options) : euclideanDistance(a, p, options);
    var azimuthAP = bearingToAzimuth((mercator !== true) ? bearing(a, p) : rhumbBearing(a, p));
    var azimuthAB = bearingToAzimuth((mercator !== true) ? bearing(a, b) : rhumbBearing(a, b));
    var angleA = Math.abs(azimuthAP - azimuthAB);
    // if (angleA > 180) angleA = Math.abs(angleA - 360);
    // if the angle PAB is obtuse its projection on the line extending the segment falls outside the segment
    // thus return distance between P and the start point A
    /*
        P__
        |\ \____
        | \     \____
        |  \         \____
        |   \_____________\
        H    A             B
     */
    if (angleA > 90) return distanceAP;

    var azimuthBA = (azimuthAB + 180) % 360;
    var azimuthBP = bearingToAzimuth((mercator !== true) ? bearing(b, p) : rhumbBearing(b, p));
    var angleB = Math.abs(azimuthBP - azimuthBA);
    if (angleB > 180) angleB = Math.abs(angleB - 360);
    // also if the angle ABP is acute the projection of P falls outside the segment, on the other side
    // so return the distance between P and the end point B
    /*
                        ____P
                   ____/   /|
              ____/       / |
         ____/           /  |
        /______________/    |
       A               B    H
    */
    if (angleB > 90) return (mercator !== true) ? distance(p, b, options) : euclideanDistance(p, b, options);
    // finally if the projection falls inside the segment
    // return the distance between P and the segment
    /*
                     P
                  __/|\
               __/   | \
            __/      |  \
         __/         |   \
        /____________|____\
       A             H     B
    */
    if (mercator !== true) return distanceAP * Math.sin(degreesToRadians(angleA));
    return mercatorPH(a, b, p, options);
}

/**
 * Returns the distance between a point P on a segment AB, on Mercator projection
 *
 * @private
 * @param {Array<number>} a first segment point
 * @param {Array<number>} b second segment point
 * @param {Array<number>} p external point
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.units='kilometers'] can be degrees, radians, miles, or kilometers
 * @returns {number} distance
 */
function mercatorPH(a, b, p, options) {
    var delta = 0;
    // translate points if any is crossing the 180th meridian
    if (Math.abs(a[0]) >= 180 || Math.abs(b[0]) >= 180 || Math.abs(p[0]) >= 180) {
        delta = (a[0] > 0 || b[0] > 0 || p[0] > 0) ? -180 : 180;
    }

    var origin = point(p);
    var A = toMercator([a[0] + delta, a[1]]);
    var B = toMercator([b[0] + delta, b[1]]);
    var P = toMercator([p[0] + delta, p[1]]);
    var h = toWgs84(euclideanIntersection(A, B, P));

    if (delta !== 0) h[0] -= delta; // translate back to original position
    var distancePH = rhumbDistance(origin, h, options);
    return distancePH;
}

/**
 * Returns the point H projection of a point P on a segment AB, on the euclidean plain
 * from https://stackoverflow.com/questions/10301001/perpendicular-on-a-line-segment-from-a-given-point#answer-12499474
 *            P
 *           |
 *           |
 *  _________|____
 * A          H   B
 *
 * @private
 * @param {Array<number>} a first segment point
 * @param {Array<number>} b second segment point
 * @param {Array<number>} p external point
 * @returns {Array<number>} projected point
 */
function euclideanIntersection(a, b, p) {
    var x1 = a[0], y1 = a[1],
        x2 = b[0], y2 = b[1],
        x3 = p[0], y3 = p[1];
    var px = x2 - x1, py = y2 - y1;
    var dab = px * px + py * py;
    var u = ((x3 - x1) * px + (y3 - y1) * py) / dab;
    var x = x1 + u * px, y = y1 + u * py;
    return [x, y]; // H
}

/**
 * Returns euclidean distance between two points
 *
 * @private
 * @param {Object} from first point
 * @param {Object} to second point
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.units='kilometers'] can be degrees, radians, miles, or kilometers
 * @returns {number} squared distance
 */
function euclideanDistance(from, to, options) {
    var units = options.units;
    // translate points if any is crossing the 180th meridian
    var delta = 0;
    if (Math.abs(from[0]) >= 180) {
        delta = (from[0] > 0) ? -180 : 180;
    }
    if (Math.abs(to[0]) >= 180) {
        delta = (to[0] > 0) ? -180 : 180;
    }
    var p1 = toMercator([from[0] + delta, from[1]]);
    var p2 = toMercator([to[0] + delta, to[1]]);

    var sqr = function (n) { return n * n; };
    var squareD = sqr(p1[0] - p2[0]) + sqr(p1[1] - p2[1]);
    var d = Math.sqrt(squareD);
    return convertLength(d, 'meters', units);
}

export default pointToLineDistance;
