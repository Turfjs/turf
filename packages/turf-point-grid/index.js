var point = require('@turf/helpers').point;
var featureCollection = require('@turf/helpers').featureCollection;
var distance = require('@turf/distance');
var turfBBox = require('@turf/bbox');

/**
 * Creates a {@link Point} grid from a bounding box, {@link FeatureCollection} or {@link Feature}.
 *
 * @name pointGrid
 * @param {Array<number>|FeatureCollection|Feature<any>} bbox extent in [minX, minY, maxX, maxY] order
 * @param {number} cellSize the distance across each cell
 * @param {string} [units=kilometers] used in calculating cellSize, can be degrees, radians, miles, or kilometers
 * @returns {FeatureCollection<Point>} grid of points
 * @example
 * var extent = [-70.823364, -33.553984, -70.473175, -33.302986];
 * var cellSize = 3;
 * var units = 'miles';
 *
 * var grid = turf.pointGrid(extent, cellSize, units);
 *
 * //=grid
 */
module.exports = function (bbox, cellSize, units) {
    var results = [];

    // validation
    if (!bbox) throw new Error('bbox is required');
    if (!Array.isArray(bbox)) bbox = turfBBox(bbox); // Convert GeoJSON to bbox
    if (bbox.length !== 4) throw new Error('bbox must contain 4 numbers');

    var west = bbox[0];
    var south = bbox[1];
    var east = bbox[2];
    var north = bbox[3];

    var xFraction = cellSize / (distance(point([west, south]), point([east, south]), units));
    var cellWidth = xFraction * (east - west);
    var yFraction = cellSize / (distance(point([west, south]), point([west, north]), units));
    var cellHeight = yFraction * (north - south);

    var currentX = west;
    while (currentX <= east) {
        var currentY = south;
        while (currentY <= north) {
            results.push(point([currentX, currentY]));
            currentY += cellHeight;
        }
        currentX += cellWidth;
    }

    return featureCollection(results);
};
