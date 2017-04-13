var inside = require('@turf/inside');
var invariant = require('@turf/invariant');
var featureEach = require('@turf/meta').featureEach;
var bbox = require('@turf/bbox');
var grid = require('@turf/point-grid');
var planepoint = require('@turf/planepoint');
var square = require('@turf/square');
var tin = require('@turf/tin');

/**
 * Takes a set of points and estimates their 'property' values on a grid.
 *
 * @name interpolate
 * @param {FeatureCollection<Point>} points a FeatureCollection of {@link Point} features
 * @param {number} cellSize the distance across each cell
 * @param {string} [property='elevation'] the property name in `points` from which z-values will be pulled
 * @param {string} [units=kilometers] miles, kilometers
 * @returns {FeatureCollection<Point>} grid of points with 'property'
 * @example



 *
 * var arc = turf.lineArc(center, radius, bearing1, bearing2);
 *
 * //addToMap
 * var addToMap = [center, arc]
 */
module.exports = function (points, cellSize, property, units) {
    // validation
    if (!points) throw new Error('points is required');
    if (!cellSize) throw new Error('points is required');
    invariant.collectionOf(points, 'Point', 'input must contain Points');

    // default values
    property = property || 'elevation';

    var tinResult = tin(points, property);
    var bboxBBox = bbox(points); // [minX, minY, maxX, maxY]
    var squareBBox = square(bboxBBox);

    var x = JSON.stringify(tinResult);

    var gridResult = grid(squareBBox, cellSize, units, true);

    // add property value to each point of the grid
    featureEach(gridResult, function (pt) {
        featureEach(tinResult, function (triangle) {
            if (inside(pt, triangle)) {
                pt.properties = {};
                pt.properties[property] = planepoint(pt, triangle);
            } else {
                pt.properties[property] = 0;
            }
        });
    });

    return gridResult;
};
