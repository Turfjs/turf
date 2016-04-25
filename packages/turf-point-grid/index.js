var point = require('turf-helpers').point;
var featurecollection = require('turf-helpers').featureCollection;
var distance = require('turf-distance');
/**
 * Takes a bounding box and a cell depth and returns a set of {@link Point|points} in a grid.
 *
 * @name pointGrid
 * @category interpolation
 * @param {Array<number>} extent extent in [minX, minY, maxX, maxY] order
 * @param {Number} cellWidth the distance across each cell
 * @param {String=kilometers} units used in calculating cellWidth
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
module.exports = function pointGrid(bbox, cell, units) {
    var fc = featurecollection([]);
    var xFraction = cell / (distance(point([bbox[0], bbox[1]]), point([bbox[2], bbox[1]]), units));
    var cellWidth = xFraction * (bbox[2] - bbox[0]);
    var yFraction = cell / (distance(point([bbox[0], bbox[1]]), point([bbox[0], bbox[3]]), units));
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
