var tin = require('@turf/tin');
var helpers = require('@turf/helpers');
var distance = require('@turf/distance');
var dissolve = require('geojson-dissolve');
var featureEach = require('@turf/meta').featureEach;
var feature = helpers.feature;
var featureCollection = helpers.featureCollection;

/**
 * Takes a set of {@link Point|points} and returns a concave hull Polygon or MultiPolygon.
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
    // validation
    if (!points) throw new Error('points is required');
    if (maxEdge === undefined || maxEdge === null) throw new Error('maxEdge is required');
    if (typeof maxEdge !== 'number') throw new Error('invalid maxEdge');

    var cleaned = removeDuplicates(points);

    var tinPolys = tin(cleaned);
    // calculate length of all edges and area of all triangles
    // and remove triangles that fail the max length test
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

    // merge the adjacent triangles
    var dissolved = dissolve(tinPolys.features);
    // geojson-dissolve always returns a MultiPolygon
    if (dissolved.coordinates.length === 1) {
        dissolved.coordinates = dissolved.coordinates[0];
        dissolved.type = 'Polygon';
    }
    return feature(dissolved);
};

/**
 * Removes duplicated points in a collection returning a new collection
 *
 * @private
 * @param {FeatureCollection<Point>} points to be cleaned
 * @returns {FeatureCollection<Point>} cleaned set of points
 */
function removeDuplicates(points) {
    var cleaned = [];
    var existing = {};

    featureEach(points, function (pt) {
        if (!pt.geometry) return;
        var key = pt.geometry.coordinates.join('-');
        if (!existing.hasOwnProperty(key)) {
            cleaned.push(pt);
            existing[key] = true;
        }
    });
    return featureCollection(cleaned);
}
