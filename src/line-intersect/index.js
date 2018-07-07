import { feature, featureCollection, point } from '../helpers';
import { getCoords } from '../invariant';
import lineSegment from '../line-segment';
import { featureEach } from '../meta';
import rbush from 'geojson-rbush';

/**
 * Takes any LineString or Polygon GeoJSON and returns the intersecting point(s).
 *
 * @name lineIntersect
 * @param {GeoJSON} line1 any LineString or Polygon
 * @param {GeoJSON} line2 any LineString or Polygon
 * @returns {FeatureCollection<Point>} point(s) that intersect both
 * @example
 * var line1 = turf.lineString([[126, -11], [129, -21]]);
 * var line2 = turf.lineString([[123, -18], [131, -14]]);
 * var intersects = turf.lineIntersect(line1, line2);
 *
 * //addToMap
 * var addToMap = [line1, line2, intersects]
 */
function lineIntersect(line1, line2) {
    const unique = {};
    const results = [];

    // First, normalize geometries to features
    // Then, handle simple 2-vertex segments
    if (line1.type === 'LineString') { line1 = feature(line1); }
    if (line2.type === 'LineString') { line2 = feature(line2); }
    if (line1.type === 'Feature' &&
        line2.type === 'Feature' &&
        line1.geometry !== null &&
        line2.geometry !== null &&
        line1.geometry.type === 'LineString' &&
        line2.geometry.type === 'LineString' &&
        line1.geometry.coordinates.length === 2 &&
        line2.geometry.coordinates.length === 2) {
        const intersect = intersects(line1, line2);
        if (intersect) { results.push(intersect); }
        return featureCollection(results);
    }

    // Handles complex GeoJSON Geometries
    const tree = rbush();
    tree.load(lineSegment(line2));
    featureEach(lineSegment(line1), function (segment)  {
        featureEach(tree.search(segment), function (match) {
            const intersect = intersects(segment, match);
            if (intersect) {
                // prevent duplicate points https://github.com/Turfjs/turf/issues/688
                const key = getCoords(intersect).join(',');
                if (!unique[key]) {
                    unique[key] = true;
                    results.push(intersect);
                }
            }
        });
    });
    return featureCollection(results);
}

/**
 * Find a point that intersects LineStrings with two coordinates each
 *
 * @private
 * @param {Feature<LineString>} line1 GeoJSON LineString (Must only contain 2 coordinates)
 * @param {Feature<LineString>} line2 GeoJSON LineString (Must only contain 2 coordinates)
 * @returns {Feature<Point>} intersecting GeoJSON Point
 */
function intersects(line1, line2) {
    const coords1 = getCoords(line1);
    const coords2 = getCoords(line2);
    if (coords1.length !== 2) {
        throw new Error('<intersects> line1 must only contain 2 coordinates');
    }
    if (coords2.length !== 2) {
        throw new Error('<intersects> line2 must only contain 2 coordinates');
    }
    const x1 = coords1[0][0];
    const y1 = coords1[0][1];
    const x2 = coords1[1][0];
    const y2 = coords1[1][1];
    const x3 = coords2[0][0];
    const y3 = coords2[0][1];
    const x4 = coords2[1][0];
    const y4 = coords2[1][1];
    const denom = ((y4 - y3) * (x2 - x1)) - ((x4 - x3) * (y2 - y1));
    const numeA = ((x4 - x3) * (y1 - y3)) - ((y4 - y3) * (x1 - x3));
    const numeB = ((x2 - x1) * (y1 - y3)) - ((y2 - y1) * (x1 - x3));

    if (denom === 0) {
        if (numeA === 0 && numeB === 0) {
            return null;
        }
        return null;
    }

    const uA = numeA / denom;
    const uB = numeB / denom;

    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
        const x = x1 + (uA * (x2 - x1));
        const y = y1 + (uA * (y2 - y1));
        return point([x, y]);
    }
    return null;
}

export default lineIntersect;
