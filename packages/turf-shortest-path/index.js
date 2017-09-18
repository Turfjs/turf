var meta = require('@turf/meta');
var helpers = require('@turf/helpers');
var squareGrid = require('@turf/square-grid');
var distance = require('@turf/distance');
var bbox = require('@turf/bbox');
var within = require('@turf/boolean-within');
var scale = require('@turf/transform-scale');
var bboxPolygon = require('@turf/bbox-polygon');
var invariant = require('@turf/invariant');
var getType = invariant.getType;
var lineString = helpers.lineString;
var inside = require('@turf/inside');
var isNumber = helpers.isNumber;
var getCoord = invariant.getCoord;

/**
 * Returns the shortest {@link LineString|path} from {@link Point|start} to {@link Point|end} without colliding with
 * any {@link Feature} in {@link FeatureCollection| obstacles}
 *
 * @name shortestPath
 * @param {Geometry|Feature<Point>} start point
 * @param {Geometry|Feature<Point>} end point
 * @param {GeometryCollection|FeatureCollection} obstacles features
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.units="kilometers"] can be degrees, radians, miles, kilometers, ...
 * @param {number} [options.resolution=64] number of steps on a rounded corner
 * @returns {Feature<LineString>} shortest path between start and end
 * @example
 * <SIMPLE EXAMPLE>
 */
module.exports = function (start, end, obstacles, options) {
    // validation
    if (!start) throw new Error('start point is required');
    if (getType(start) !== 'Point') throw new Error('start must be Point');
    if (!end) throw new Error('end point is required');
    if (getType(end) !== 'Point') throw new Error('end must be Point');
    if (!obstacles) throw new Error('obstacles collection is required');
    if (getType(obstacles) !== 'Point') throw new Error('obstacles must be FeatureCollection');

    // no obstacles
    if (obstacles.features.length === 0) return lineString([getCoord(start), getCoord(end)]);

    options = options || {};
    var units = options.units || 'kilometers';
    var resolution = options.resolution;
    if (!isNumber(resolution) || resolution <= 0) throw new Error('resolution must be a number greater than 0');
    var box = bbox(obstacles); // [minX, minY, maxX, maxY]
    box = bbox(scale(bboxPolygon(box), 1.15)); // extend 15%
    if (!resolution) {
        var width = distance([box[0], box[1]], [box[2], box[1]], units);
        resolution = width / 100;
    }

    var grid = squareGrid(box, resolution, units);

    for (var i = 0; i < obstacles.features.length; i++) {
        for (var j = 0; j < grid.features.length; j++) {

            var isInside = inside(points.features[j], polygons.features[i]);
            if (within()) {
                pointsWithin.features.push(points.features[j]);
            }
        }
    }

    return true;
};

