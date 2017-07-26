var bbox = require('@turf/bbox');
var meta = require('@turf/meta');
var helpers = require('@turf/helpers');
var invariant = require('@turf/invariant');
var gridToMatrix = require('grid-to-matrix');
var marchingsquares = require('marchingsquares');
var multiLineString = helpers.multiLineString;
var coordEach = meta.coordEach;
var collectionOf = invariant.collectionOf;
var featureCollection = helpers.featureCollection;

/**
 * Takes a grid {@link FeatureCollection} of {@link Point} features with z-values and an array of
 * value breaks and generates [isolines](http://en.wikipedia.org/wiki/Isoline).
 *
 * @name isolines
 * @param {FeatureCollection<Point>} pointGrid input points
 * @param {Array<number>} breaks values of `zProperty` where to draw isolines
 * @param {string} [zProperty='elevation'] the property name in `points` from which z-values will be pulled
 * @param {Object} [propertiesToAllIsolines={}] GeoJSON properties passed to ALL isolines
 * @param {Array<Object>} [propertiesPerIsoline=[]] GeoJSON properties passed, in order, to the correspondent isoline;
 * the breaks array will define the order in which the isolines are created
 * @returns {FeatureCollection<MultiLineString>} a FeatureCollection of {@link MultiLineString} features representing isolines
 * @example
 * // create a grid of points with random z-values in their properties
 * var extent = [0, 30, 20, 50];
 * var cellWidth = 100;
 * var units = 'miles';
 * var pointGrid = turf.pointGrid(extent, cellWidth, units);
 * for (var i = 0; i < pointGrid.features.length; i++) {
 *     pointGrid.features[i].properties.temperature = Math.random() * 10;
 * }
 * var breaks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
 *
 * var isolines = turf.isolines(pointGrid, breaks, 'temperature');
 *
 * //addToMap
 * var addToMap = [isolines];
 */
module.exports = function (pointGrid, breaks, zProperty, propertiesToAllIsolines, propertiesPerIsoline) {
    // Default Params
    zProperty = zProperty || 'elevation';
    propertiesToAllIsolines = propertiesToAllIsolines || {};
    propertiesPerIsoline = propertiesPerIsoline || [];

    // Input validation
    collectionOf(pointGrid, 'Point', 'Input must contain Points');
    if (!breaks) throw new Error('breaks is required');
    if (!Array.isArray(breaks)) throw new Error('breaks must be an Array');
    if (!isObject(propertiesToAllIsolines)) throw new Error('propertiesToAllIsolines must be an Object');
    if (!Array.isArray(propertiesPerIsoline)) throw new Error('propertiesPerIsoline must be an Array');
    if (typeof zProperty !== 'string') throw new Error('zProperty must be a string');

    // Isoline methods
    var matrix = gridToMatrix(pointGrid, zProperty, true);
    var isolines = createIsoLines(matrix, breaks, zProperty, propertiesToAllIsolines, propertiesPerIsoline);
    var scaledIsolines = rescaleIsolines(isolines, matrix, pointGrid);

    return featureCollection(scaledIsolines);
};

/**
 * Creates the isolines lines (featuresCollection of MultiLineString features) from the 2D data grid
 *
 * Marchingsquares process the grid data as a 3D representation of a function on a 2D plane, therefore it
 * assumes the points (x-y coordinates) are one 'unit' distance. The result of the isolines function needs to be
 * rescaled, with turfjs, to the original area and proportions on the map
 *
 * @private
 * @param {Array<Array<number>>} matrix Grid Data
 * @param {Array<number>} breaks Breaks
 * @param {string} zProperty name of the z-values property
 * @param {Object} [propertiesToAllIsolines={}] GeoJSON properties passed to ALL isolines
 * @param {Object} [propertiesPerIsoline=[]] GeoJSON properties passed to the correspondent isoline
 * @returns {Array<MultiLineString>} isolines
 */
function createIsoLines(matrix, breaks, zProperty, propertiesToAllIsolines, propertiesPerIsoline) {
    var isolines = [];
    for (var i = 1; i < breaks.length; i++) {
        var threshold = +breaks[i]; // make sure it's a number

        var properties = Object.assign(
            {},
            propertiesToAllIsolines,
            propertiesPerIsoline[i]
        );
        properties[zProperty] = threshold;
        var isoline = multiLineString(marchingsquares.isoContours(matrix, threshold), properties);

        isolines.push(isoline);
    }
    return isolines;
}

/**
 * Translates and scales isolines
 *
 * @private
 * @param {Array<MultiLineString>} isolines to be rescaled
 * @param {Array<Array<number>>} matrix Grid Data
 * @param {Object} points Points by Latitude
 * @returns {Array<MultiLineString>} isolines
 */
function rescaleIsolines(isolines, matrix, points) {

    // get dimensions (on the map) of the original grid
    var gridBbox = bbox(points); // [ minX, minY, maxX, maxY ]
    var originalWidth = gridBbox[2] - gridBbox[0];
    var originalHeigth = gridBbox[3] - gridBbox[1];

    // get origin, which is the first point of the last row on the rectangular data on the map
    var x0 = gridBbox[0];
    var y0 = gridBbox[1];

    // get number of cells per side
    var matrixWidth = matrix[0].length - 1;
    var matrixHeight = matrix.length - 1;

    // calculate the scaling factor between matrix and rectangular grid on the map
    var scaleX = originalWidth / matrixWidth;
    var scaleY = originalHeigth / matrixHeight;

    var resize = function (point) {
        point[0] = point[0] * scaleX + x0;
        point[1] = point[1] * scaleY + y0;
    };

    // resize and shift each point/line of the isolines
    isolines.forEach(function (isoline) {
        coordEach(isoline, resize);
    });
    return isolines;
}

/**
 * Checks input type
 *
 * @private
 * @param {*} input to be checked
 * @returns {boolean} true if the input is an Object
 */
function isObject(input) {
    return (!!input) && (input.constructor === Object);
}
