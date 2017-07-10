var meta = require('@turf/meta');
var bbox = require('@turf/bbox');
var poinGrid = require('@turf/point-grid');
var distance = require('@turf/distance');
var invariant = require('@turf/invariant');
var featureEach = meta.featureEach;
var collectionOf = invariant.collectionOf;

/**
 * Takes a set of points and estimates their 'property' values on a grid using the Inverse Distance Weighting (IDW) method.](https://en.wikipedia.org/wiki/Inverse_distance_weighting.
 *
 * @name interpolate
 * @param {FeatureCollection<Point>} points with known value
 * @param {number} cellSize the distance across each grid point
 * @param {string} [property='elevation'] the property name in `points` from which z-values will be pulled
 * @param {string} [units=kilometers] used in calculating cellSize, can be degrees, radians, miles, or kilometers
 * @param {number} [weight=1] exponent regulating the distance-decay weighting
 * @returns {FeatureCollection<Point>} grid of points with 'property'
 * @example
 * var points = turf.random('points', 30, {
 *     bbox: [50, 30, 70, 50]
 * });
 * // add a random property to each point
 * turf.featureEach(points, function(point) {
 *     point.properties.solRad = Math.random() * 50;
 * });
 * var grid = interpolate(points, 100, 'solRad', 'miles');
 *
 * //addToMap
 * var addToMap = grid
 */
module.exports = function (points, cellSize, property, units, weight) {
    // validation
    if (!points) throw new Error('points is required');
    collectionOf(points, 'Point', 'input must contain Points');
    if (!cellSize) throw new Error('cellSize is required');
    if (weight !== undefined && typeof weight !== 'number') throw new Error('weight must be a number');

    // default values
    property = property || 'elevation';
    weight = weight || 1;

    // create the point grid
    var grid = poinGrid(bbox(points), cellSize, units, true);

    featureEach(grid, function (gridPoint) {
        var zw = 0;
        var sw = 0;
        // calculate the distance from each input point to the grid points
        featureEach(points, function (point) {
            var d = distance(gridPoint, point, units);
            var zValue;
            // property has priority for zValue, fallbacks to 3rd coordinate from geometry
            if (property !== undefined) zValue = point.properties[property];
            if (zValue === undefined) zValue = point.geometry.coordinates[2];
            if (zValue === undefined) throw new Error('zValue is missing');
            if (d === 0) zw = zValue;
            var w = 1.0 / Math.pow(d, weight);
            sw += w;
            zw += w * zValue;
        });
        // write interpolated value for each grid point
        gridPoint.properties[property] = zw / sw;
    });

    return grid;
};
