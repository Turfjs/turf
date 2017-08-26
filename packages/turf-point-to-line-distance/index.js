var invariant = require('@turf/invariant');
var featureOf = invariant.featureOf;
var helpers = require('@turf/helpers');
var meta = require('@turf/meta');
var distance = require('@turf/distance');
var bearing = require('@turf/bearing');
var turfPoint = helpers.point;
var radiansToDistance = helpers.radiansToDistance;
var degrees2radians = helpers.degrees2radians;
var bearingToAngle = helpers.bearingToAngle;
var segmentEach = meta.segmentEach;
var turfLine = helpers.lineString;

/**
 * Returns the minimum distance between a {@link Point} and a {@link LineString}, being the distance from a line the
 * minimum distance between the point and any segment of the `LineString`.
 * (from: https://stackoverflow.com/questions/32771458/distance-from-lat-lng-point-to-minor-arc-segment)
 *
 * @name pointToLineDistance
 * @param {Feature<Point>|Array<number>} point Feature or Geometry
 * @param {Feature<LineString>|Array<<Array<number>>} line GeoJSON Feature or Geometry
 * @param {string} [units=kilometers] can be degrees, radians, miles, or kilometers
 * @returns {number} distance between point and line
 * @example
 * var pt = turf.point([0, 0]);
 * var line = turf.lineString([[1, 1],[-1, 1]);
 *
 * var d = pointToLineDistance(point, line, 'degrees');
 * //=1
 */
module.exports = function (point, line, units) {
    // validation
    if (!point) throw new Error('point is required');
    if (Array.isArray(point)) point = turfPoint(point);
    else featureOf(point, 'Point', 'point');
    if (!line) throw new Error('line is required');
    if (Array.isArray(line)) line = turfLine(line);
    else featureOf(line, 'LineString', 'line');

    var distance = Infinity;
    var pt = point.geometry.coordinates;
    segmentEach(line, function (segment) {
        var d = distanceToSegment(pt, segment.geometry.coordinates, units);
        if (distance > d) distance = d;
    });
    return distance;
};


function distanceToSegment(p, segment, units) {
    var R = {
        miles: 3960,
        nauticalmiles: 3441.145,
        degrees: 57.2957795,
        radians: 1,
        inches: 250905600,
        yards: 6969600,
        meters: 6373000,
        metres: 6373000,
        centimeters: 6.373e+8,
        centimetres: 6.373e+8,
        kilometers: 6373,
        kilometres: 6373,
        feet: 20908792.65
    };

    var a = segment[0];
    var b = segment[1];

    var distanceAP = distance(a, p, units);
    var bearingAP = bearing(a, p);
    var bearingAB = bearing(a, b);
    var relativeBearing = bearingAP - bearingAB;
    // if relative bearing is obtuse its projection on the line extending the segment falls outside the segment
    // thus return distance to start point
    if (Math.abs(relativeBearing) > 90) return distanceAP;

    var segmentLength = distance(a, b, units);
    // calculate distance between p and its projection along the line extending the segment
    var projection = Math.asin(Math.sin(distanceAP / R[units]) * Math.sin(bearingAP - bearingAB)) * R[units];
    // calculate distance between start point to projected point on line
    var distanceAprogection = Math.acos(Math.cos(distanceAP / R[units]) / Math.cos(projection / R[units])) * R[units];
    // if relative bearing is acute and the projection falls outside the segment
    // return the distance between p and the end point
    if (distanceAprogection > segmentLength) return distance(p, b, units);
    // else the projection falls inside the segment
    // so return the distance between p and the segment
    return Math.abs(projection);
}

// /**
//  * (from: https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment/1501725#1501725)
//  *
//  */
// function distanceToSegment(pt, segment, units) {
//     var start = {
//         x: segment[0][0],
//         y: segment[0][1]
//     };
//     var end = {
//         x: segment[1][0],
//         y: segment[1][1]
//     };
//
//     var length = distanceSquared(start, end);
//     if (length === 0) throw new Error('invalid segment in line');
//
//     var point = {
//         x: pt[0],
//         y: pt[1]
//     };
//
//     // Consider the line extending the segment, parametrized as
//     //   start + t * (end - start).
//     // The projection of p onto the line falls where
//     //   t = [(p - start) * (end - start)] / |end - start|^2
//     // We clamp t from [0,1] to handle points outside the segment.
//     var t = (
//         (point.x - start.x) * (end.x - start.x) +
//         (point.y - start.y) * (end.y - start.y)
//     ) / length;
//     t = Math.max(0, Math.min(1, t));
//
//     var d = distanceSquared(point, {
//         x: start.x + t * (end.x - start.x),
//         y: start.y + t * (end.y - start.y)
//     });
//     // convert degrees to units
//     return radiansToDistance(degrees2radians(Math.sqrt(d)), units);
// }
//
// /**
//  * Returns the squared distance between points
//  *
//  * @private
//  * @param {object} p1 point
//  * @param {object} p2 point
//  * @returns {number} squared distance
//  */
// function distanceSquared(p1, p2) {
//     return sqr(p1.x - p2.x) + sqr(p1.y - p2.y);
// }
//
// /**
//  * Returns the square of a number, to avoid Math.pow for performance improvement
//  *
//  * @private
//  * @param {number} n number
//  * @returns {number} square
//  */
// function sqr(n) {
//     return n * n;
// }
