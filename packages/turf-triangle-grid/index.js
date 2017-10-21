import distance from '@turf/distance';
import { polygon, featureCollection } from '@turf/helpers';

/**
 * Takes a bounding box and a cell depth and returns a set of triangular {@link Polygon|polygons} in a grid.
 *
 * @name triangleGrid
 * @param {Array<number>} bbox extent in [minX, minY, maxX, maxY] order
 * @param {number} cellSide dimension of each cell
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.units='kilometers'] used in calculating cellSide, can be degrees, radians, miles, or kilometers
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
    if (typeof options !== 'object') throw new Error('options is invalid');

    var fc = featureCollection([]);
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
            if (xi % 2 === 0 && yi % 2 === 0) {
                fc.features.push(polygon([[
                    [currentX, currentY],
                    [currentX, currentY + cellHeight],
                    [currentX + cellWidth, currentY],
                    [currentX, currentY]
                ]]), polygon([[
                    [currentX, currentY + cellHeight],
                    [currentX + cellWidth, currentY + cellHeight],
                    [currentX + cellWidth, currentY],
                    [currentX, currentY + cellHeight]
                ]]));
            } else if (xi % 2 === 0 && yi % 2 === 1) {
                fc.features.push(polygon([[
                    [currentX, currentY],
                    [currentX + cellWidth, currentY + cellHeight],
                    [currentX + cellWidth, currentY],
                    [currentX, currentY]
                ]]), polygon([[
                    [currentX, currentY],
                    [currentX, currentY + cellHeight],
                    [currentX + cellWidth, currentY + cellHeight],
                    [currentX, currentY]
                ]]));
            } else if (yi % 2 === 0 && xi % 2 === 1) {
                fc.features.push(polygon([[
                    [currentX, currentY],
                    [currentX, currentY + cellHeight],
                    [currentX + cellWidth, currentY + cellHeight],
                    [currentX, currentY]
                ]]), polygon([[
                    [currentX, currentY],
                    [currentX + cellWidth, currentY + cellHeight],
                    [currentX + cellWidth, currentY],
                    [currentX, currentY]
                ]]));
            } else if (yi % 2 === 1 && xi % 2 === 1) {
                fc.features.push(polygon([[
                    [currentX, currentY],
                    [currentX, currentY + cellHeight],
                    [currentX + cellWidth, currentY],
                    [currentX, currentY]
                ]]), polygon([[
                    [currentX, currentY + cellHeight],
                    [currentX + cellWidth, currentY + cellHeight],
                    [currentX + cellWidth, currentY],
                    [currentX, currentY + cellHeight]
                ]]));
            }
            currentY += cellHeight;
            yi++;
        }
        xi++;
        currentX += cellWidth;
    }
    return fc;
}


export default triangleGrid;
