var point = require('turf-helpers').point;
var featurecollection = require('turf-helpers').featureCollection;
var distance = require('turf-distance');
/**
 * Takes a bounding box and a cell depth and returns a set of {@link Point|points} in a grid.
 *
 * @name pointGrid
 * @param {Array<number>} bbox extent in [minX, minY, maxX, maxY] order
 * @param {number} cellSize the distance across each cell
 * @param {string} [units=kilometers] used in calculating cellWidth, can be degrees, radians, miles, or kilometers
 * @return {FeatureCollection<Point>} grid of points
 * @example
 * var extent = [-70.823364, -33.553984, -70.473175, -33.302986];
 * var cellWidth = 3;
 * var units = 'miles';
 *
 * var grid = turf.pointGrid(extent, cellWidth, units);
 *
 * //=grid
 */
module.exports = function pointGrid(bbox, cellSize, units) {
    var fc = featurecollection([]);
    var xFraction = cellSize / (distance(point([bbox[0], bbox[1]]), point([bbox[2], bbox[1]]), units));
    var cellWidth = xFraction * (bbox[2] - bbox[0]);
    var yFraction = cellSize / (distance(point([bbox[0], bbox[1]]), point([bbox[0], bbox[3]]), units));
    var cellHeight = yFraction * (bbox[3] - bbox[1]);

    var currentX = bbox[0];
    while (currentX <= bbox[2]) {
        var currentY = bbox[1];
        while (currentY <= bbox[3]) {
            fc.features.push(point([currentX, currentY]));

            currentY += cellHeight;
        }
        currentX += cellWidth;
    }

    return fc;
};
