import distance from '@turf/distance';
import intersect from '@turf/intersect';
import {getType} from '@turf/invariant';
import {polygon, featureCollection, isObject, isNumber} from '@turf/helpers';

/**
 * Takes a bounding box and a cell depth and returns a set of triangular {@link Polygon|polygons} in a grid.
 *
 * @name triangleGrid
 * @param {Array<number>} bbox extent in [minX, minY, maxX, maxY] order
 * @param {number} cellSide dimension of each cell
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.units='kilometers'] used in calculating cellSide, can be degrees, radians, miles, or kilometers
 * @param {Feature<Polygon|MultiPolygon>} [options.mask] if passed a Polygon or MultiPolygon, the grid Points will be created only inside it
 * @param {Object} [options.properties={}] passed to each point of the grid
 * @returns {FeatureCollection<Polygon>} grid of polygons
 * @example
 * var bbox = [-95, 30 ,-85, 40];
 * var cellSide = 50;
 * var options = {units: 'miles'};
 *
 * var triangleGrid = turf.triangleGrid(bbox, cellSide, options);
 *
 * //addToMap
 * var addToMap = [triangleGrid];
 */
function triangleGrid(bbox, cellSide, options) {
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

    // Main
    var xFraction = cellSide / (distance([bbox[0], bbox[1]], [bbox[2], bbox[1]], options));
    var cellWidth = xFraction * (bbox[2] - bbox[0]);
    var yFraction = cellSide / (distance([bbox[0], bbox[1]], [bbox[0], bbox[3]], options));
    var cellHeight = yFraction * (bbox[3] - bbox[1]);

    var xi = 0;
    var currentX = bbox[0];
    while (currentX <= bbox[2]) {
        var yi = 0;
        var currentY = bbox[1];
        while (currentY <= bbox[3]) {
            var cellTriangle1 = null;
            var cellTriangle2 = null;

            if (xi % 2 === 0 && yi % 2 === 0) {
                cellTriangle1 = polygon([[
                    [currentX, currentY],
                    [currentX, currentY + cellHeight],
                    [currentX + cellWidth, currentY],
                    [currentX, currentY]
                ]], properties);
                cellTriangle2 = polygon([[
                    [currentX, currentY + cellHeight],
                    [currentX + cellWidth, currentY + cellHeight],
                    [currentX + cellWidth, currentY],
                    [currentX, currentY + cellHeight]
                ]], properties);
            } else if (xi % 2 === 0 && yi % 2 === 1) {
                cellTriangle1 = polygon([[
                    [currentX, currentY],
                    [currentX + cellWidth, currentY + cellHeight],
                    [currentX + cellWidth, currentY],
                    [currentX, currentY]
                ]], properties);
                cellTriangle2 = polygon([[
                    [currentX, currentY],
                    [currentX, currentY + cellHeight],
                    [currentX + cellWidth, currentY + cellHeight],
                    [currentX, currentY]
                ]], properties);
            } else if (yi % 2 === 0 && xi % 2 === 1) {
                cellTriangle1 = polygon([[
                    [currentX, currentY],
                    [currentX, currentY + cellHeight],
                    [currentX + cellWidth, currentY + cellHeight],
                    [currentX, currentY]
                ]], properties);
                cellTriangle2 = polygon([[
                    [currentX, currentY],
                    [currentX + cellWidth, currentY + cellHeight],
                    [currentX + cellWidth, currentY],
                    [currentX, currentY]
                ]], properties);
            } else if (yi % 2 === 1 && xi % 2 === 1) {
                cellTriangle1 = polygon([[
                    [currentX, currentY],
                    [currentX, currentY + cellHeight],
                    [currentX + cellWidth, currentY],
                    [currentX, currentY]
                ]], properties);
                cellTriangle2 = polygon([[
                    [currentX, currentY + cellHeight],
                    [currentX + cellWidth, currentY + cellHeight],
                    [currentX + cellWidth, currentY],
                    [currentX, currentY + cellHeight]
                ]], properties);
            }
            if (mask) {
                if (intersect(mask, cellTriangle1)) results.push(cellTriangle1);
                if (intersect(mask, cellTriangle2)) results.push(cellTriangle2);
            } else {
                results.push(cellTriangle1);
                results.push(cellTriangle2);
            }

            currentY += cellHeight;
            yi++;
        }
        xi++;
        currentX += cellWidth;
    }
    return featureCollection(results);
}

export default triangleGrid;
