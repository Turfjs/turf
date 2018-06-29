import { isObject, featureCollection, point } from '@turf/helpers';
import rhumbDestination from '@turf/rhumb-destination';

/**
 * Takes a {@link Point} grid and returns a correspondent matrix {Array<Array<number>>}
 * of the 'property' values
 *
 * @name matrixToGrid
 * @param {Array<Array<number>>} matrix of numbers
 * @param {Point|Array<number>} origin position of the first bottom-left (South-West) point of the grid
 * @param {number} cellSize the distance across each cell
 * @param {Object} [options={}] optional parameters
 * @param {string} [options.zProperty='elevation'] the grid points property name associated with the matrix value
 * @param {Object} [options.properties={}] GeoJSON properties passed to all the points
 * @param {string} [options.units='kilometers'] used in calculating cellSize, can be miles, or kilometers
 * @returns {FeatureCollection<Point>} grid of points
 *
 * @example
 *    var matrixToGrid = require('matrix-to-grid');
 *    var matrix = [
 *      [ 1, 13, 20,  9, 10, 13, 18],
 *      [34,  8,  0,  4,  5,  8, 13],
 *      [10,  5,  2,  1,  2,  5, 24],
 *      [ 0,  4, 56, 19,  0,  4,  9],
 *      [10,  5,  2, 12,  2,  5, 10],
 *      [57,  8,  5,  4,  5,  0, 57],
 *      [ 3, 13,  0,  9,  5, 13, 35],
 *      [18, 13, 10,  9, 78, 13, 18]
 *    ];
 *    var origin = [-70.823364, -33.553984]
 *    matrixToGrid(matrix, origin, 10);
 *    //= pointGrid
 */
export default function matrixToGrid(matrix, origin, cellSize, options) {
    // Optional parameters
    options = options || {};
    if (!isObject(options)) throw new Error('options is invalid');
    var zProperty = options.zProperty || 'elevation';
    var properties = options.properties;
    var units = options.units;

    // validation
    if (!matrix || !Array.isArray(matrix)) throw new Error('matrix is required');
    if (!origin) throw new Error('origin is required');
    if (Array.isArray(origin)) {
        origin = point(origin); // Convert coordinates array to point
    }
    // all matrix array have to be of the same size
    var matrixCols = matrix[0].length;
    var matrixRows = matrix.length;
    for (var row = 1; row < matrixRows; row++) {
        if (matrix[row].length !== matrixCols) throw new Error('matrix requires all rows of equal size');
    }

    var points = [];
    for (var r = 0; r < matrixRows; r++) {
        // create first point in the row
        var first = rhumbDestination(origin, cellSize * r, 0, { units: units });
        first.properties[zProperty] = matrix[matrixRows - 1 - r][0];
        for (var prop in properties) {
            first.properties[prop] = properties[prop];
        }
        points.push(first);
        for (var c = 1; c < matrixCols; c++) {
            // create the other points in the same row
            var pt = rhumbDestination(first, cellSize * c, 90, { units: units });
            for (var prop2 in properties) {
                pt.properties[prop2] = properties[prop2];
            }
            // add matrix property
            var val = matrix[matrixRows - 1 - r][c];
            pt.properties[zProperty] = val;
            points.push(pt);
        }
    }
    var grid = featureCollection(points);
    return grid;
}
