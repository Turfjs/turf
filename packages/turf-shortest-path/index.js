import bbox from '@turf/bbox';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import distance from '@turf/distance';
import scale from '@turf/transform-scale';
import cleanCoords from '@turf/clean-coords';
import bboxPolygon from '@turf/bbox-polygon';
import { getCoord, getType, getGeom } from '@turf/invariant';
import { point, isNumber, lineString, isObject, featureCollection, feature } from '@turf/helpers';
import { Graph, astar } from './lib/javascript-astar';

/**
 * Returns the shortest {@link LineString|path} from {@link Point|start} to {@link Point|end} without colliding with
 * any {@link Feature} in {@link FeatureCollection<Polygon>| obstacles}
 *
 * @name shortestPath
 * @param {Coord} start point
 * @param {Coord} end point
 * @param {Object} [options={}] optional parameters
 * @param {Geometry|Feature|FeatureCollection<Polygon>} [options.obstacles] areas which path cannot travel
 * @param {number} [options.minDistance] minimum distance between shortest path and obstacles
 * @param {string} [options.units='kilometers'] unit in which resolution & minimum distance will be expressed in; it can be degrees, radians, miles, kilometers, ...
 * @param {number} [options.resolution=100] distance between matrix points on which the path will be calculated
 * @returns {Feature<LineString>} shortest path between start and end
 * @example
 * var start = [-5, -6];
 * var end = [9, -6];
 * var options = {
 *   obstacles: turf.polygon([[[0, -7], [5, -7], [5, -3], [0, -3], [0, -7]]])
 * };
 *
 * var path = turf.shortestPath(start, end, options);
 *
 * //addToMap
 * var addToMap = [start, end, options.obstacles, path];
 */
function shortestPath(start, end, options) {
    // Optional parameters
    options = options || {};
    if (!isObject(options)) throw new Error('options is invalid');
    var resolution = options.resolution;
    var minDistance = options.minDistance;
    var obstacles = options.obstacles || featureCollection([]);

    // validation
    if (!start) throw new Error('start is required');
    if (!end) throw new Error('end is required');
    if (resolution && !isNumber(resolution) || resolution <= 0) throw new Error('options.resolution must be a number, greater than 0');
    if (minDistance) throw new Error('options.minDistance is not yet implemented');

    // Normalize Inputs
    var startCoord = getCoord(start);
    var endCoord = getCoord(end);
    start = point(startCoord);
    end = point(endCoord);

    // Handle obstacles
    switch (getType(obstacles)) {
    case 'FeatureCollection':
        if (obstacles.features.length === 0) return lineString([startCoord, endCoord]);
        break;
    case 'Polygon':
        obstacles = featureCollection([feature(getGeom(obstacles))]);
        break;
    default:
        throw new Error('invalid obstacles');
    }

    // define path grid area
    var collection = obstacles;
    collection.features.push(start);
    collection.features.push(end);
    var box = bbox(scale(bboxPolygon(bbox(collection)), 1.15)); // extend 15%
    if (!resolution) {
        var width = distance([box[0], box[1]], [box[2], box[1]], options);
        resolution = width / 100;
    }
    collection.features.pop();
    collection.features.pop();

    var west = box[0];
    var south = box[1];
    var east = box[2];
    var north = box[3];

    var xFraction = resolution / (distance([west, south], [east, south], options));
    var cellWidth = xFraction * (east - west);
    var yFraction = resolution / (distance([west, south], [west, north], options));
    var cellHeight = yFraction * (north - south);

    var bboxHorizontalSide = (east - west);
    var bboxVerticalSide = (north - south);
    var columns = Math.floor(bboxHorizontalSide / cellWidth);
    var rows = Math.floor(bboxVerticalSide / cellHeight);
    // adjust origin of the grid
    var deltaX = (bboxHorizontalSide - columns * cellWidth) / 2;
    var deltaY = (bboxVerticalSide - rows * cellHeight) / 2;

    // loop through points only once to speed up process
    // define matrix grid for A-star algorithm
    var pointMatrix = [];
    var matrix = [];

    var closestToStart = [];
    var closestToEnd = [];
    var minDistStart = Infinity;
    var minDistEnd = Infinity;
    var currentY = north - deltaY;
    var r = 0;
    while (currentY >= south) {
        // var currentY = south + deltaY;
        var matrixRow = [];
        var pointMatrixRow = [];
        var currentX = west + deltaX;
        var c = 0;
        while (currentX <= east) {
            var pt = point([currentX, currentY]);
            var isInsideObstacle = isInside(pt, obstacles);
            // feed obstacles matrix
            matrixRow.push(isInsideObstacle ? 0 : 1); // with javascript-astar
            // matrixRow.push(isInsideObstacle ? 1 : 0); // with astar-andrea
            // map point's coords
            pointMatrixRow.push(currentX + '|' + currentY);
            // set closest points
            var distStart = distance(pt, start);
            // if (distStart < minDistStart) {
            if (!isInsideObstacle && distStart < minDistStart) {
                minDistStart = distStart;
                closestToStart = {x: c, y: r};
            }
            var distEnd = distance(pt, end);
            // if (distEnd < minDistEnd) {
            if (!isInsideObstacle && distEnd < minDistEnd) {
                minDistEnd = distEnd;
                closestToEnd = {x: c, y: r};
            }
            currentX += cellWidth;
            c++;
        }
        matrix.push(matrixRow);
        pointMatrix.push(pointMatrixRow);
        currentY -= cellHeight;
        r++;
    }

    // find path on matrix grid

    // javascript-astar ----------------------
    var graph = new Graph(matrix, {diagonal: true});
    var startOnMatrix = graph.grid[closestToStart.y][closestToStart.x];
    var endOnMatrix = graph.grid[closestToEnd.y][closestToEnd.x];
    var result = astar.search(graph, startOnMatrix, endOnMatrix);

    var path = [startCoord];
    result.forEach(function (coord) {
        var coords = pointMatrix[coord.x][coord.y].split('|');
        path.push([+coords[0], +coords[1]]); // make sure coords are numbers
    });
    path.push(endCoord);
    // ---------------------------------------


    // astar-andrea ------------------------
    // var result = aStar(matrix, [closestToStart.x, closestToStart.y], [closestToEnd.x, closestToEnd.y], 'DiagonalFree');
    // var path = [start.geometry.coordinates];
    // result.forEach(function (coord) {
    //     var coords = pointMatrix[coord[1]][coord[0]].split('|');
    //     path.push([+coords[0], +coords[1]]); // make sure coords are numbers
    // });
    // path.push(end.geometry.coordinates);
    // ---------------------------------------


    return cleanCoords(lineString(path));
}

/**
 * Checks if Point is inside any of the Polygons
 *
 * @private
 * @param {Feature<Point>} pt to check
 * @param {FeatureCollection<Polygon>} polygons features
 * @returns {boolean} if inside or not
 */
function isInside(pt, polygons) {
    for (var i = 0; i < polygons.features.length; i++) {
        if (booleanPointInPolygon(pt, polygons.features[i])) {
            return true;
        }
    }
    return false;
}

export default shortestPath;
