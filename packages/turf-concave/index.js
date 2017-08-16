// 1. run tin on points
// 2. calculate length of all edges and area of all triangles
// 3. remove triangles that fail the max length test
// 4. buffer the results slightly
// 5. merge the results
var tin = require('@turf/tin');
var union = require('@turf/union');
var distance = require('@turf/distance');
var clone = require('@turf/clone');

/**
 * Takes a set of {@link Point|points} and returns a concave hull polygon.
 * Internally, this uses [turf-tin](https://github.com/Turfjs/turf-tin) to generate geometries.
 *
 * @name concave
 * @param {FeatureCollection<Point>} points input points
 * @param {number} maxEdge the length (in 'units') of an edge necessary for part of the hull to become concave
 * @param {string} [units=kilometers] can be degrees, radians, miles, or kilometers
 * @returns {Feature<(Polygon|MultiPolygon)>} a concave hull
 * @throws {Error} if maxEdge parameter is missing or unable to compute hull
 * @example
 * var points = turf.featureCollection([
 *   turf.point([-63.601226, 44.642643]),
 *   turf.point([-63.591442, 44.651436]),
 *   turf.point([-63.580799, 44.648749]),
 *   turf.point([-63.573589, 44.641788]),
 *   turf.point([-63.587665, 44.64533]),
 *   turf.point([-63.595218, 44.64765])
 * ]);
 *
 * var hull = turf.concave(points, 1, 'miles');
 *
 * //addToMap
 * var addToMap = [points, hull]
 */
module.exports = function (points, maxEdge, units) {
    if (!points) throw new Error('points is required');
    if (maxEdge === undefined || maxEdge === null) throw new Error('maxEdge is required');
    if (typeof maxEdge !== 'number') throw new Error('invalid maxEdge');

    var tinPolys = tin(points);
    tinPolys.features = tinPolys.features.filter(function (triangle) {
        var pt1 = triangle.geometry.coordinates[0][0];
        var pt2 = triangle.geometry.coordinates[0][1];
        var pt3 = triangle.geometry.coordinates[0][2];
        var dist1 = distance(pt1, pt2, units);
        var dist2 = distance(pt2, pt3, units);
        var dist3 = distance(pt1, pt3, units);
        return (dist1 <= maxEdge && dist2 <= maxEdge && dist3 <= maxEdge);
    });

    if (tinPolys.features.length < 1) throw new Error('too few polygons found to compute concave hull');

    return merge(tinPolys.features);
};

/**
 * Merges/Unifies all the features in a single polygon
 *
 * @private
 * @param {Array<Feature>} features to be merged
 * @returns {Feature<(Polygon|MultiPolygon)>} merged result
 */
function merge(features) {
    var merged = clone(features[0]);
    merged.properties = {};

    for (var i = 0, len = features.length; i < len; i++) {
        var poly = features[i];
        if (poly.geometry) merged = union(merged, poly);
    }
    return merged;
}
