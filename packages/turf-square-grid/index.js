import distance from '@turf/distance';
import intersect from '@turf/intersect';
import {getType} from '@turf/invariant';
import {polygon, featureCollection, isObject, isNumber} from '@turf/helpers';

/**
 * Creates a square grid from a bounding box, {@link Feature} or {@link FeatureCollection}.
 *
 * @name squareGrid
 * @param {Array<number>} bbox extent in [minX, minY, maxX, maxY] order
 * @param {number} cellSide of each cell, in units
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.units='kilometers'] used in calculating cellSide, can be degrees, radians, miles, or kilometers
 * @param {Feature<Polygon|MultiPolygon>} [options.mask] if passed a Polygon or MultiPolygon, the grid Points will be created only inside it
 * @param {Object} [options.properties={}] passed to each point of the grid
 * @returns {FeatureCollection<Polygon>} grid a grid of polygons
 * @example
 * var bbox = [-95, 30 ,-85, 40];
 * var cellSide = 50;
 * var options = {units: 'miles'};
 *
 * var squareGrid = turf.squareGrid(bbox, cellSide, options);
 *
 * //addToMap
 * var addToMap = [squareGrid]
 */
function squareGrid(bbox, cellSide, options) {
    // Optional parameters
    options = options || {};
    if (!isObject(options)) throw new Error('options is invalid');
    // var units = options.units;
    var properties = options.properties;
    var mask = options.mask;

    // Containers
    var results = [];

    // Input Validation
    if (cellSide === null || cellSide === undefined) throw new Error('cellSide is required');
    if (!isNumber(cellSide)) throw new Error('cellSide is invalid');
    if (!bbox) throw new Error('bbox is required');
    if (!Array.isArray(bbox)) throw new Error('bbox must be array');
    if (bbox.length !== 4) throw new Error('bbox must contain 4 numbers');
    if (mask && ['Polygon', 'MultiPolygon'].indexOf(getType(mask)) === -1) throw new Error('options.mask must be a (Multi)Polygon');

    var west = bbox[0];
    var south = bbox[1];
    var east = bbox[2];
    var north = bbox[3];

    var xFraction = cellSide / (distance([west, south], [east, south], options));
    var cellWidth = xFraction * (east - west);
    var yFraction = cellSide / (distance([west, south], [west, north], options));
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
            if (mask) {
                if (intersect(mask, cellPoly)) results.push(cellPoly);
            } else {
                results.push(cellPoly);
            }

            currentY += cellHeight;
        }
        currentX += cellWidth;
    }
    return featureCollection(results);
}

export default squareGrid;
