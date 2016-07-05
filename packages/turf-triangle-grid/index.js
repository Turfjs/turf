var featurecollection = require('turf-helpers').featureCollection;
var polygon = require('turf-helpers').polygon;
var distance = require('turf-distance');

/**
 * Takes a bounding box and a cell depth and returns a set of triangular {@link Polygon|polygons} in a grid.
 *
 * @name triangleGrid
 * @param {Array<number>} bbox extent in [minX, minY, maxX, maxY] order
 * @param {number} cellSize dimension of each cell
 * @param {string} units units to use for cellWidth
 * @return {FeatureCollection<Polygon>} grid of polygons
 * @example
 * var extent = [-77.3876953125,38.71980474264239,-76.9482421875,39.027718840211605];
 * var cellWidth = 10;
 * var units = 'miles';
 *
 * var triangleGrid = turf.triangleGrid(extent, cellWidth, units);
 *
 * //=triangleGrid
 */
module.exports = function (bbox, cellSize, units) {
    var fc = featurecollection([]);
    var xFraction = cellSize / (distance([bbox[0], bbox[1]], [bbox[2], bbox[1]], units));
    var cellWidth = xFraction * (bbox[2] - bbox[0]);
    var yFraction = cellSize / (distance([bbox[0], bbox[1]], [bbox[0], bbox[3]], units));
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
};

