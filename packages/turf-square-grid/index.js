import distance from '@turf/distance';
import turfBBox from '@turf/bbox';
import { point, polygon, featureCollection, isObject } from '@turf/helpers';

/**
 * Creates a square grid from a bounding box, {@link Feature} or {@link FeatureCollection}.
 *
 * @name squareGrid
 * @param {Array<number>|FeatureCollection|Feature<any>} bbox extent in [minX, minY, maxX, maxY] order
 * @param {number} cellSize width of each cell
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.units='kilometers'] used in calculating cellSize, can be degrees, radians, miles, or kilometers
 * @param {boolean} [options.completelyWithin=false] adjust width & height cellSize to fit exactly within bbox
 * @returns {FeatureCollection<Polygon>} grid a grid of polygons
 * @example
 * var bbox = [-95, 30 ,-85, 40];
 * var cellSize = 50;
 *
 * var squareGrid = turf.squareGrid(bbox, cellSize, {units: 'miles'});
 *
 * //addToMap
 * var addToMap = [squareGrid]
 */
function squareGrid(bbox, cellSize, options) {
    // Optional parameters
    options = options || {};
    if (!isObject(options)) throw new Error('options is invalid');
    var completelyWithin = options.completelyWithin;

    // Containers
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
    var xDistance = distance(point([west, south]), point([east, south]), options);
    var yDistance = distance(point([west, south]), point([west, north]), options);

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
}

export default squareGrid;
