// 1. run tin on points
// 2. calculate lenth of all edges and area of all triangles
// 3. remove triangles that fail the max length test
// 4. buffer the results slightly
// 5. merge the results
var tin = require('@turf/tin');
var union = require('@turf/union');
var distance = require('@turf/distance');

/**
 * Takes a set of {@link Point|points} and returns a concave hull polygon.
 * Internally, this uses [turf-tin](https://github.com/Turfjs/turf-tin) to generate geometries.
 *
 * @param {FeatureCollection<Point>} points input points
 * @param {number} maxEdge the size of an edge necessary for part of the hull to become concave (in miles)
 * @param {string} [units=kilometers] can be degrees, radians, miles, or kilometers
 * @returns {Feature<Polygon>} a concave hull
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
function concave(points, maxEdge, units) {
    if (typeof maxEdge !== 'number') throw new Error('maxEdge parameter is required');

    var tinPolys = tin(points);
    var filteredPolys = tinPolys.features.filter(filterTriangles);
    tinPolys.features = filteredPolys;
    if (tinPolys.features.length < 1) {
        throw new Error('too few polygons found to compute concave hull');
    }

    function filterTriangles(triangle) {
        var pt1 = triangle.geometry.coordinates[0][0];
        var pt2 = triangle.geometry.coordinates[0][1];
        var pt3 = triangle.geometry.coordinates[0][2];
        var dist1 = distance(pt1, pt2, units);
        var dist2 = distance(pt2, pt3, units);
        var dist3 = distance(pt1, pt3, units);
        return (dist1 <= maxEdge && dist2 <= maxEdge && dist3 <= maxEdge);
    }

    return merge(tinPolys);
}

function merge(polygons) {
    var merged = JSON.parse(JSON.stringify(polygons.features[0])),
        features = polygons.features;

    for (var i = 0, len = features.length; i < len; i++) {
        var poly = features[i];
        if (poly.geometry) {
            merged = union(merged, poly);
        }
    }
    return merged;
}

module.exports = concave;
