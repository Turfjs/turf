import within from '@turf/boolean-within';
import distance from '@turf/distance';
import {getType} from '@turf/invariant';
import {point, featureCollection, isObject, isNumber} from '@turf/helpers';

/**
 * Creates a {@link Point} grid from a bounding box, {@link FeatureCollection} or {@link Feature}.
 *
 * @name pointGrid
 * @param {Array<number>} bbox extent in [minX, minY, maxX, maxY] order
 * @param {number} cellSide the distance between points, in units
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.units='kilometers'] used in calculating cellSide, can be degrees, radians, miles, or kilometers
 * @param {Feature<Polygon|MultiPolygon>} [options.mask] if passed a Polygon or MultiPolygon, the grid Points will be created only inside it
 * @param {Object} [options.properties={}] passed to each point of the grid
 * @returns {FeatureCollection<Point>} grid of points
 * @example
 * var extent = [-70.823364, -33.553984, -70.473175, -33.302986];
 * var cellSide = 3;
 * var options = {units: 'miles'};
 *
 * var grid = turf.pointGrid(extent, cellSide, options);
 *
 * //addToMap
 * var addToMap = [grid];
 */
function pointGrid(bbox, cellSide, options) {
    // Optional parameters
    options = options || {};
    if (!isObject(options)) throw new Error('options is invalid');
    // var units = options.units;
    var mask = options.mask;
    var properties = options.properties;

    // Containers
    var results = [];

    // Input Validation
    if (cellSide === null || cellSide === undefined) throw new Error('cellSide is required');
    if (!isNumber(cellSide)) throw new Error('cellSide is invalid');
    if (!bbox) throw new Error('bbox is required');
    if (!Array.isArray(bbox)) throw new Error('bbox must be array');
    if (bbox.length !== 4) throw new Error('bbox must contain 4 numbers');
    if (mask && ['Polygon', 'MultiPolygon'].indexOf(getType(mask)) === -1) throw new Error('options.mask must be a (Multi)Polygon');

    var west = bbox[0];
    var south = bbox[1];
    var east = bbox[2];
    var north = bbox[3];

    var xFraction = cellSide / (distance([west, south], [east, south], options));
    var cellWidth = xFraction * (east - west);
    var yFraction = cellSide / (distance([west, south], [west, north], options));
    var cellHeight = yFraction * (north - south);

    var bboxWidth = (east - west);
    var bboxHeight = (north - south);
    var columns = Math.floor(bboxWidth / cellWidth);
    var rows = Math.floor(bboxHeight / cellHeight);
    // adjust origin of the grid
    var deltaX = (bboxWidth - columns * cellWidth) / 2;
    var deltaY = (bboxHeight - rows * cellHeight) / 2;

    var currentX = west + deltaX;
    while (currentX <= east) {
        var currentY = south + deltaY;
        while (currentY <= north) {
            var cellPt = point([currentX, currentY], properties);
            if (mask) {
                if (within(cellPt, mask)) results.push(cellPt);
            } else {
                results.push(cellPt);
            }
            currentY += cellHeight;
        }
        currentX += cellWidth;
    }

    return featureCollection(results);
}

export default pointGrid;
