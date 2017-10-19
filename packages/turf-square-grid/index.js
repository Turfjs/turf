import distance from '@turf/distance';
import {point, polygon, featureCollection, isObject, isNumber} from '@turf/helpers';

/**
 * Creates a square grid from a bounding box, {@link Feature} or {@link FeatureCollection}.
 *
 * @name squareGrid
 * @param {Array<number>} bbox extent in [minX, minY, maxX, maxY] order
 * @param {number} cellSide of each cell, in units
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.units='kilometers'] used in calculating cellSize, can be degrees, radians, miles, or kilometers
 * @param {Object} [options.properties={}] passed to each square of the grid
 * @returns {FeatureCollection<Polygon>} grid a grid of polygons
 * @example
 * var bbox = [-95, 30 ,-85, 40];
 * var cellSize = 50;
 *
 * var squareGrid = turf.squareGrid(bbox, cellSize, {units: 'miles'});
 *
 * //addToMap
 * var addToMap = [squareGrid]
 */
function squareGrid(bbox, cellSide, options) {
    // Optional parameters
    options = options || {};
    if (!isObject(options)) throw new Error('options is invalid');
    var units = options.units;
    var properties = options.properties || {};

    // Containers
    var results = [];

    // validation
    if (cellSide === null || cellSide === undefined) throw new Error('cellSide is required');
    if (!isNumber(cellSide)) throw new Error('cellSide is invalid');
    if (!bbox) throw new Error('bbox is required');
    if (!Array.isArray(bbox)) throw new Error('bbox must be array');
    if (bbox.length !== 4) throw new Error('bbox must contain 4 numbers');

    var west = bbox[0];
    var south = bbox[1];
    var east = bbox[2];
    var north = bbox[3];

    var xFraction = cellSide / (distance(point([west, south]), point([east, south]), units));
    var cellWidth = xFraction * (east - west);
    var yFraction = cellSide / (distance(point([west, south]), point([west, north]), units));
    var cellHeight = yFraction * (north - south);

    // rows & columns
    var bboxWidth = (east - west);
    var bboxHeight = (north - south);
    var columns = Math.floor(bboxWidth / cellWidth);
    var rows = Math.floor(bboxHeight / cellHeight);

    // adjust origin of the grid
    var deltaX = (bboxWidth - columns * cellWidth) / 2;
    var deltaY = (bboxHeight - rows * cellHeight) / 2;

    // iterate over columns & rows
    var currentX = west + deltaX;
    for (var column = 0; column < columns; column++) {
        var currentY = south + deltaY;
        for (var row = 0; row < rows; row++) {
            var cellPoly = polygon([[
                [currentX, currentY],
                [currentX, currentY + cellHeight],
                [currentX + cellWidth, currentY + cellHeight],
                [currentX + cellWidth, currentY],
                [currentX, currentY]
            ]], properties);
            results.push(cellPoly);

            currentY += cellHeight;
        }
        currentX += cellWidth;
    }
    return featureCollection(results);
}

export default squareGrid;
