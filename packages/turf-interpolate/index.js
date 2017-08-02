var meta = require('@turf/meta');
var bbox = require('@turf/bbox');
var hexGrid = require('@turf/hex-grid');
var poinGrid = require('@turf/point-grid');
var distance = require('@turf/distance');
var centroid = require('@turf/centroid');
var invariant = require('@turf/invariant');
var squareGrid = require('@turf/square-grid');
var triangleGrid = require('@turf/triangle-grid');
var featureEach = meta.featureEach;
var collectionOf = invariant.collectionOf;

/**
 * Takes a set of points and estimates their 'property' values on a grid using the [Inverse Distance Weighting (IDW) method](https://en.wikipedia.org/wiki/Inverse_distance_weighting).
 *
 * @name interpolate
 * @param {FeatureCollection<Point>} points with known value
 * @param {number} cellSize the distance across each grid point
 * @param {string} [gridType='square'] defines the output format based on a Grid Type (options: 'square' | 'point' | 'hex' | 'triangle')
 * @param {string} [property='elevation'] the property name in `points` from which z-values will be pulled, zValue fallbacks to 3rd coordinate if no property exists.
 * @param {string} [units=kilometers] used in calculating cellSize, can be degrees, radians, miles, or kilometers
 * @param {number} [weight=1] exponent regulating the distance-decay weighting
 * @returns {FeatureCollection<Point|Polygon>} grid of points or polygons with interpolated 'property'
 * @example
 * var points = turf.random('points', 30, {
 *     bbox: [50, 30, 70, 50]
 * });
 * // add a random property to each point
 * turf.featureEach(points, function(point) {
 *     point.properties.solRad = Math.random() * 50;
 * });
 * var grid = turf.interpolate(points, 100, 'points', 'solRad', 'miles');
 *
 * //addToMap
 * var addToMap = [grid];
 */
module.exports = function (points, cellSize, gridType, property, units, weight) {
    // validation
    if (!points) throw new Error('points is required');
    collectionOf(points, 'Point', 'input must contain Points');
    if (!cellSize) throw new Error('cellSize is required');
    if (weight !== undefined && typeof weight !== 'number') throw new Error('weight must be a number');

    // default values
    property = property || 'elevation';
    gridType = gridType || 'square';
    weight = weight || 1;

    var box = bbox(points);
    var grid;
    switch (gridType) {
    case 'point':
    case 'points':
        grid = poinGrid(box, cellSize, units, true);
        break;
    case 'square':
    case 'squares':
        grid = squareGrid(box, cellSize, units);
        break;
    case 'hex':
    case 'hexes':
        grid = hexGrid(box, cellSize, units);
        break;
    case 'triangle':
    case 'triangles':
        grid = triangleGrid(box, cellSize, units);
        break;
    default:
        throw new Error('invalid gridType');
    }

    featureEach(grid, function (gridFeature) {
        var zw = 0;
        var sw = 0;
        // calculate the distance from each input point to the grid points
        featureEach(points, function (point) {
            var gridPoint = (gridType === 'point') ? gridFeature : centroid(gridFeature);
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
        gridFeature.properties[property] = zw / sw;
    });

    return grid;
};
