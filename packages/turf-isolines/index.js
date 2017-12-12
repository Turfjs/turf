import bbox from '@turf/bbox';
import { coordEach } from '@turf/meta';
import { collectionOf } from '@turf/invariant';
import { multiLineString, featureCollection, isObject } from '@turf/helpers';
import isoContours from './lib/marchingsquares-isocontours';
import gridToMatrix from './lib/grid-to-matrix';

/**
 * Takes a grid {@link FeatureCollection} of {@link Point} features with z-values and an array of
 * value breaks and generates [isolines](http://en.wikipedia.org/wiki/Isoline).
 *
 * @name isolines
 * @param {FeatureCollection<Point>} pointGrid input points
 * @param {Array<number>} breaks values of `zProperty` where to draw isolines
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.zProperty='elevation'] the property name in `points` from which z-values will be pulled
 * @param {Object} [options.commonProperties={}] GeoJSON properties passed to ALL isolines
 * @param {Array<Object>} [options.breaksProperties=[]] GeoJSON properties passed, in order, to the correspondent isoline;
 * the breaks array will define the order in which the isolines are created
 * @returns {FeatureCollection<MultiLineString>} a FeatureCollection of {@link MultiLineString} features representing isolines
 * @example
 * // create a grid of points with random z-values in their properties
 * var extent = [0, 30, 20, 50];
 * var cellWidth = 100;
 * var pointGrid = turf.pointGrid(extent, cellWidth, {units: 'miles'});
 *
 * for (var i = 0; i < pointGrid.features.length; i++) {
 *     pointGrid.features[i].properties.temperature = Math.random() * 10;
 * }
 * var breaks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
 *
 * var lines = turf.isolines(pointGrid, breaks, {zProperty: 'temperature'});
 *
 * //addToMap
 * var addToMap = [lines];
 */
function isolines(pointGrid, breaks, options) {
    // Optional parameters
    options = options || {};
    if (!isObject(options)) throw new Error('options is invalid');
    var zProperty = options.zProperty || 'elevation';
    var commonProperties = options.commonProperties || {};
    var breaksProperties = options.breaksProperties || [];

    // Input validation
    collectionOf(pointGrid, 'Point', 'Input must contain Points');
    if (!breaks) throw new Error('breaks is required');
    if (!Array.isArray(breaks)) throw new Error('breaks must be an Array');
    if (!isObject(commonProperties)) throw new Error('commonProperties must be an Object');
    if (!Array.isArray(breaksProperties)) throw new Error('breaksProperties must be an Array');

    // Isoline methods
    var matrix = gridToMatrix(pointGrid, {zProperty: zProperty, flip: true});
    var createdIsoLines = createIsoLines(matrix, breaks, zProperty, commonProperties, breaksProperties);
    var scaledIsolines = rescaleIsolines(createdIsoLines, matrix, pointGrid);

    return featureCollection(scaledIsolines);
}

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
 * @param {Object} [commonProperties={}] GeoJSON properties passed to ALL isolines
 * @param {Object} [breaksProperties=[]] GeoJSON properties passed to the correspondent isoline
 * @returns {Array<MultiLineString>} isolines
 */
function createIsoLines(matrix, breaks, zProperty, commonProperties, breaksProperties) {
    var results = [];
    for (var i = 1; i < breaks.length; i++) {
        var threshold = +breaks[i]; // make sure it's a number

        var properties = Object.assign(
            {},
            commonProperties,
            breaksProperties[i]
        );
        properties[zProperty] = threshold;
        var isoline = multiLineString(isoContours(matrix, threshold), properties);

        results.push(isoline);
    }
    return results;
}

/**
 * Translates and scales isolines
 *
 * @private
 * @param {Array<MultiLineString>} createdIsoLines to be rescaled
 * @param {Array<Array<number>>} matrix Grid Data
 * @param {Object} points Points by Latitude
 * @returns {Array<MultiLineString>} isolines
 */
function rescaleIsolines(createdIsoLines, matrix, points) {

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

    // resize and shift each point/line of the createdIsoLines
    createdIsoLines.forEach(function (isoline) {
        coordEach(isoline, resize);
    });
    return createdIsoLines;
}

export default isolines;
