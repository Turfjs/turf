var helpers = require('@turf/helpers');
var pointGrid = require('@turf/point-grid');
var distance = require('@turf/distance');
var bbox = require('@turf/bbox');
var clone = require('@turf/clone');
var scale = require('@turf/transform-scale');
var cleanCoords = require('@turf/clean-coords');
var bboxPolygon = require('@turf/bbox-polygon');
var invariant = require('@turf/invariant');
var getType = invariant.getType;
var lineString = helpers.lineString;
var inside = require('@turf/inside');
var isNumber = helpers.isNumber;
var getCoord = invariant.getCoord;
var gridToMatrix = require('grid-to-matrix');

var jsastar = require('javascript-astar');
var Graph = jsastar.Graph;
var astar = jsastar.astar;

// var ezStar = require('easystarjs');
// var pathfinding = require('pathfinding');

/**
 * Returns the shortest {@link LineString|path} from {@link Point|start} to {@link Point|end} without colliding with
 * any {@link Feature} in {@link FeatureCollection| obstacles}
 *
 * @name shortestPath
 * @param {Geometry|Feature<Point>} start point
 * @param {Geometry|Feature<Point>} end point
 * @param {GeometryCollection|FeatureCollection} obstacles polygons
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.units="kilometers"] can be degrees, radians, miles, kilometers, ...
 * @param {number} [options.resolution=100] proportional to the distance between matrix points on which the path will be calculated
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
    if (getType(obstacles) !== 'FeatureCollection') throw new Error('obstacles must be FeatureCollection');

    // no obstacles
    if (obstacles.features.length === 0) return lineString([getCoord(start), getCoord(end)]);

    options = options || {};
    var units = options.units || 'kilometers';
    var resolution = options.resolution;
    if (resolution && !isNumber(resolution) || resolution <= 0) throw new Error('resolution must be a number, greater than 0');

    var collection = clone(obstacles);
    collection.features.push(start);
    collection.features.push(end);

    var box = bbox(scale(bboxPolygon(bbox(collection)), 1.15)); // extend 15%
    if (!resolution) {
        var width = distance([box[0], box[1]], [box[2], box[1]], units);
        resolution = width / 100;
    }

    var grid = pointGrid(box, resolution, units);

    var closestToStart = null;
    var closestToEnd = null;
    var minDistStart = Infinity;
    var minDistEnd = Infinity;
    for (var i = 0; i < obstacles.features.length; i++) {
        for (var j = 0; j < grid.features.length; j++) {
            var pt = grid.features[j];
            var poly = obstacles.features[i];
            // pt.properties.walkable = inside(pt, poly) ? 1 : 0;
            var isInside = inside(pt, poly);
            pt.properties.wall = isInside ? 0 : 1;
            // flag closest grid point to path endpoints
            var distStart = distance(pt, start);
            if (distStart < minDistStart) {
                minDistStart = distStart;
                closestToStart = pt;
            }
            var distEnd = distance(pt, end);
            if (distEnd < minDistEnd) {
                minDistEnd = distEnd;
                closestToEnd = pt;
            }
        }
    }

    var matrix = gridToMatrix(grid, 'wall', false, true);
    var gridMap = {};
    grid.features.forEach(function (point) {
        var label = point.properties.matrixPosition[0] + '-' + point.properties.matrixPosition[1];
        gridMap[label] = point;
    });

    var graph = new Graph(matrix, {diagonal: true});
    var startCoords = closestToStart.properties.matrixPosition;
    var endCoords = closestToEnd.properties.matrixPosition;

    var startOnMatrix = graph.grid[startCoords[0]][startCoords[1]];
    var endOnMatrix = graph.grid[endCoords[0]][endCoords[1]];
    var result = astar.search(graph, startOnMatrix, endOnMatrix);

    var path = [start.geometry.coordinates];
    result.forEach(function (point, i) {
        var label = point.x + '-' + point.y;
        var coords = gridMap[label].geometry.coordinates;
        path.push(coords);
    });
    path.push(end.geometry.coordinates);

    return cleanCoords(lineString(path));
};

