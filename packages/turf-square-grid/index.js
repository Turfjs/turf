var featureCollection = require('@turf/helpers').featureCollection;
var point = require('@turf/helpers').point;
var polygon = require('@turf/helpers').polygon;
var distance = require('@turf/distance');

/**
 * Takes a bounding box and a cell depth and returns a set of square {@link Polygon|polygons} in a grid.
 *
 * @name squareGrid
 * @param {Array<number>} bbox extent in [minX, minY, maxX, maxY] order
 * @param {number} cellSize width of each cell
 * @param {string} [units=kilometers] used in calculating cellSize, can be degrees, radians, miles, or kilometers
 * @return {FeatureCollection<Polygon>} grid a grid of polygons
 * @example
 * var bbox = [-96,31,-84,40];
 * var cellSize = 10;
 * var units = 'miles';
 *
 * var squareGrid = turf.squareGrid(bbox, cellSize, units);
 *
 * //=squareGrid
 */
module.exports = function squareGrid(bbox, cellSize, units) {
    var results = [];
    var xFraction = cellSize / (distance(point([bbox[0], bbox[1]]), point([bbox[2], bbox[1]]), units));
    var cellWidth = xFraction * (bbox[2] - bbox[0]);
    var yFraction = cellSize / (distance(point([bbox[0], bbox[1]]), point([bbox[0], bbox[3]]), units));
    var cellHeight = yFraction * (bbox[3] - bbox[1]);

    var currentX = bbox[0];
    while (currentX <= bbox[2]) {
        var currentY = bbox[1];
        while (currentY <= bbox[3]) {
            var cellPoly = polygon([[
                [currentX, currentY],
                [currentX, currentY + cellHeight],
                [currentX + cellWidth, currentY + cellHeight],
                [currentX + cellWidth, currentY],
                [currentX, currentY]
            ]]);
            results.push(cellPoly);

            currentY += cellHeight;
        }
        currentX += cellWidth;
    }

    return featureCollection(results);
};
