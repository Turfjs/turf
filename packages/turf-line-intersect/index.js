'use strict';

/**
 * Takes two GeoJSON LineStrings and returns the intersecting point(s).
 *
 * @name lineIntersect
 * @param {Feature<LineString>} line1 GeoJSON LineString Feature
 * @param {Feature<LineString>} line2 GeoJSON LineString Feature
 * @returns {FeatureCollection<Point>} point(s) that intersect both lines
 * @example
 * var line1 = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "LineString",
 *     "coordinates": [
 *       [
 *         126.16699218749999,
 *         -11.049038346537094
 *       ],
 *       [
 *         129.4189453125,
 *         -21.57571893245848
 *       ]
 *     ]
 *   }
 * };
 * var line2 = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "LineString",
 *     "coordinates": [
 *       [
 *         123.134765625,
 *         -18.18760655249461
 *       ],
 *       [
 *         131.1767578125,
 *         -14.987239525774244
 *       ]
 *     ]
 *   }
 * };
 * var points = turf.lineIntersect(line1, line2);
 * //= points
 */
var index_es6 = function (line1, line2) {
};

module.exports = index_es6;
