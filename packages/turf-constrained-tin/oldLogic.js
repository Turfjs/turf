"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// http://en.wikipedia.org/wiki/Delaunay_triangulation
// https://github.com/mikolalysenko/cdt2d
var helpers_1 = require("@turf/helpers");
var cdt2d = require('cdt2d');
/**
 * Takes a set of {@link Point|points} and creates a
 * constrained [Triangulated Irregular Network](http://en.wikipedia.org/wiki/Triangulated_irregular_network),
 * or a TIN for short, returned as a collection of Polygons. These are often used
 * for developing elevation contour maps or stepped heat visualizations.
 *
 * If an optional z-value property is provided then it is added as properties called `a`, `b`,
 * and `c` representing its value at each of the points that represent the corners of the
 * triangle.
 *
 * @name constrainedTin
 * @param {FeatureCollection<Point>} points input points
 * @param {Array<Array<number>>} [edges] list of edges
 * @param {Object} [options] option switches
 *   {boolean} [delaunay]: if this flag is set to true, then the resulting triangulation is converted to a Delaunay triangulation by edge flipping.
 *   Otherwise if it is false, then an arbitrary triangulation is returned. (Default true)
 *   {boolean} [interior]: (Default true) if it is false, interior faces are not output.
 *   {boolean} [exterior]: (Default true) if it is false, exterior faces are not output.
 *   {boolean} [infinity]: if it is true, then the triangulation is augmented with a point at infinity represented by the index -1. (Default false)
 *   {String} [z]: name of the property from which to pull z values
 *   This is optional: if not given, then there will be no extra data added to the derived triangles.
 * @returns {FeatureCollection<Polygon>} TIN output
 * @example
 * // generate some random point data
 * var points = turf.randomPoint(30, {bbox: [50, 30, 70, 50]});
 *
 * // add a random property to each point between 0 and 9
 * for (var i = 0; i < points.features.length; i++) {
 *   points.features[i].properties.z = ~~(Math.random() * 9);
 * }
 * var tin = turf.constrainedTin(points, [], {z: 'z'});
 *
 * //addToMap
 * var addToMap = [tin, points]
 * for (var i = 0; i < tin.features.length; i++) {
 *   var properties  = tin.features[i].properties;
 *   properties.fill = '#' + properties.a + properties.b + properties.c;
 * }
 */
function constrainedTin(points, edges, options) {
    if (edges === void 0) { edges = []; }
    if (options === void 0) { options = {}; }
    var isPointZ = false;
    var pointsForCdt2d = points.features.reduce(function (prev, p) {
        var xy = [
            p.geometry.coordinates[0],
            p.geometry.coordinates[1]
        ];
        var z = "";
        if (options.z) {
            z = p.properties[options.z];
        }
        else if (p.geometry.coordinates.length === 3) {
            isPointZ = true;
            z = p.geometry.coordinates[2];
        }
        prev[0].push(xy);
        prev[1].push(z);
        return prev;
    }, [[], []]);
    var copyOptions = Object.assign({}, options);
    delete copyOptions.z;
    var cdt2dResult;
    try {
        cdt2dResult = cdt2d(pointsForCdt2d[0], edges, copyOptions);
    }
    catch (err) {
        throw 'Something wrong with arguments: Check length of points, edge crossing, etc.';
    }
    return helpers_1.featureCollection(cdt2dResult.map(function (triangle) {
        var a = Object.assign([], pointsForCdt2d[0][triangle[0]]);
        var b = Object.assign([], pointsForCdt2d[0][triangle[1]]);
        var c = Object.assign([], pointsForCdt2d[0][triangle[2]]);
        var properties = {};
        // Add z coordinates to triangle points if user passed
        // them in that way otherwise add it as a property.
        if (isPointZ) {
            a.push(pointsForCdt2d[1][triangle[0]]);
            b.push(pointsForCdt2d[1][triangle[1]]);
            c.push(pointsForCdt2d[1][triangle[2]]);
        }
        else {
            properties = {
                a: pointsForCdt2d[1][triangle[0]],
                b: pointsForCdt2d[1][triangle[1]],
                c: pointsForCdt2d[1][triangle[2]]
            };
        }
        return helpers_1.polygon([[a, b, c, a]], properties);
    }));
}
exports.default = constrainedTin;
