'use strict';

var coordEach = require('@turf/meta').coordEach;
var rbush = require('rbush');

/**
 * Takes two GeoJSON LineStrings and returns the intersecting point(s).
 *
 * @name lineIntersect
 * @param {Feature<LineString>} line1 GeoJSON LineString Feature
 * @param {Feature<LineString>} line2 GeoJSON LineString Feature
 * @param {boolean} [debug=false] Debug mode
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
module.exports = function (line1, line2, debug) {
    var tree1 = lineTree(line1);
    return line1;
};

/**
 * Builds two coordinate line segment RBush index from LineString
 *
 * @private
 * @param {Feature<LineString>} line GeoJSON LineString
 * @returns {RBush} RBush Tree
 */
function lineTree(line) {
    var tree = rbush();
    coordEach(line, function (coords) {
        console.log(coords);
    });
    return tree;
}
