var distance = require('@turf/distance');
var turfBBox = require('@turf/bbox');
var helpers = require('@turf/helpers');
var point = helpers.point;
var polygon = helpers.polygon;
var featureCollection = helpers.featureCollection;

/**
 * Creates a square grid from a bounding box, {@link Feature} or {@link FeatureCollection}.
 *
 * @name squareGrid
 * @param {Array<number>|FeatureCollection|Feature<any>} bbox extent in [minX, minY, maxX, maxY] order
 * @param {number} cellSize width of each cell
 * @param {string} [units=kilometers] used in calculating cellSize, can be degrees, radians, miles, or kilometers
 * @param {boolean} [completelyWithin=false] adjust width & height cellSize to fit exactly within bbox
 * @returns {FeatureCollection<Polygon>} grid a grid of polygons
 * @example
 * var bbox = [-95, 30 ,-85, 40];
 * var cellSize = 50;
 * var units = 'miles';
 *
 * var squareGrid = turf.squareGrid(bbox, cellSize, units);
 *
 * //addToMap
 * var addToMap = [squareGrid]
 */
module.exports = function squareGrid(bbox, cellSize, units, completelyWithin) {
    var results = [];

    // validation
    if (!bbox) throw new Error('bbox is required');
    if (!Array.isArray(bbox)) bbox = turfBBox(bbox); // Convert GeoJSON to bbox
    if (bbox.length !== 4) throw new Error('bbox must contain 4 numbers');

    var west = bbox[0];
    var south = bbox[1];
    var east = bbox[2];
    var north = bbox[3];

    // distance
    var xDistance = distance(point([west, south]), point([east, south]), units);
    var yDistance = distance(point([west, south]), point([west, north]), units);

    // rows & columns
    var columns = Math.ceil(xDistance / cellSize);
    var rows = Math.ceil(yDistance / cellSize);

    // columns | width | x
    var xFraction = cellSize / xDistance;
    var cellWidth = xFraction * (east - west);
    if (completelyWithin === true) cellWidth = cellWidth * ((xDistance / cellSize) / columns);

    // rows | height | y
    var yFraction = cellSize / yDistance;
    var cellHeight = yFraction * (north - south);
    if (completelyWithin === true) cellHeight = cellHeight * ((yDistance / cellSize) / rows);

    // iterate over columns & rows
    var currentX = west;
    for (var column = 0; column < columns; column++) {
        var currentY = south;
        for (var row = 0; row < rows; row++) {
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
