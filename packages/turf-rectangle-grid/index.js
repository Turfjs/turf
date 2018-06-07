var boolean_intersects_1 = require("@turf/boolean-intersects");
var distance_1 = require("@turf/distance");
var helpers_1 = require("@turf/helpers");
/**
 * Creates a grid of rectangles from a bounding box, {@link Feature} or {@link FeatureCollection}.
 *
 * @name rectangleGrid
 * @param {Array<number>} bbox extent in [minX, minY, maxX, maxY] order
 * @param {number} cellWidth of each cell, in units
 * @param {number} cellHeight of each cell, in units
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.units='kilometers'] units ("degrees", "radians", "miles", "kilometers") that the given cellWidth 
 * and cellHeight are expressed in. Converted at the southern border.
 * @param {Feature<Polygon|MultiPolygon>} [options.mask] if passed a Polygon or MultiPolygon,
 * the grid Points will be created only inside it
 * @param {Object} [options.properties={}] passed to each point of the grid
 * @returns {FeatureCollection<Polygon>} a grid of polygons
 * @example
 * var bbox = [-95, 30 ,-85, 40];
 * var cellWidth = 50;
 * var cellHeight = 20;
 * var options = {units: 'miles'};
 *
 * var squareGrid = turf.rectangleGrid(bbox, cellWidth, cellHeight, options);
 *
 * //addToMap
 * var addToMap = [squareGrid]
 */
export default function rectangleGrid(bbox, cellWidth, cellHeight, options) {
    if (options === void 0) { options = {}; }
    // Containers
    var results = [];
    var west = bbox[0];
    var south = bbox[1];
    var east = bbox[2];
    var north = bbox[3];
    var xFraction = cellWidth / (distance_1.default([west, south], [east, south], options));
    var cellWidthDeg = xFraction * (east - west);
    var yFraction = cellHeight / (distance_1.default([west, south], [west, north], options));
    var cellHeightDeg = yFraction * (north - south);
    // rows & columns
    var bboxWidth = (east - west);
    var bboxHeight = (north - south);
    var columns = Math.floor(bboxWidth / cellWidthDeg);
    var rows = Math.floor(bboxHeight / cellHeightDeg);
    // if the grid does not fill the bbox perfectly, center it.
    var deltaX = (bboxWidth - columns * cellWidthDeg) / 2;
    var deltaY = (bboxHeight - rows * cellHeightDeg) / 2;
    // iterate over columns & rows
    var currentX = west + deltaX;
    for (var column = 0; column < columns; column++) {
        var currentY = south + deltaY;
        for (var row = 0; row < rows; row++) {
            var cellPoly = helpers_1.polygon([[
                    [currentX, currentY],
                    [currentX, currentY + cellHeightDeg],
                    [currentX + cellWidthDeg, currentY + cellHeightDeg],
                    [currentX + cellWidthDeg, currentY],
                    [currentX, currentY],
                ]], options.properties);
            if (options.mask) {
                if (boolean_intersects_1.default(options.mask, cellPoly)) {
                    results.push(cellPoly);
                }
            } else {
                results.push(cellPoly);
            }
            currentY += cellHeightDeg;
        }
        currentX += cellWidthDeg;
    }
    return helpers_1.featureCollection(results);
}

