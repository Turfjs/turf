var helpers = require('@turf/helpers');
var distance = require('@turf/distance');
var bbox = require('@turf/bbox');
var scale = require('@turf/transform-scale');
var cleanCoords = require('@turf/clean-coords');
var bboxPolygon = require('@turf/bbox-polygon');
var invariant = require('@turf/invariant');
// var getType = invariant.getType;
var lineString = helpers.lineString;
var point = helpers.point;
var inside = require('@turf/inside');
var isNumber = helpers.isNumber;
var getCoord = invariant.getCoord;

var jsastar = require('javascript-astar');
var Graph = jsastar.Graph;
var astar = jsastar.astar;

// var ezStar = require('easystarjs');
var pathfinding = require('pathfinding');

/**
 * Returns the shortest {@link LineString|path} from {@link Point|start} to {@link Point|end} without colliding with
 * any {@link Feature} in {@link FeatureCollection<Polygon>| obstacles}
 *
 * @name shortestPath
 * @param {Geometry|Feature<Point>} start point
 * @param {Geometry|Feature<Point>} end point
 * @param {GeometryCollection|FeatureCollection<Polygon>} obstacles polygons
 * @param {Object} [options={}] optional parameters
 * @param {string} [options.units="kilometers"] unit in which resolution will be expressed in; it can be degrees, radians, miles, kilometers, ...
 * @param {number} [options.resolution=100] distance between matrix points on which the path will be calculated
 * @returns {Feature<LineString>} shortest path between start and end
 * @example
 * var start = turf.point([-5, -6]);
 * var end = turf.point([9, -6]);
 * var obstacles = turf.featureCollection([turf.polygon([[0,-7],[5,-7],[5,-3],[0,-3],[0,-7]]));
 *
 * var path = shortestPath(start, end, obstacles);
 *
 * //addToMap
 * var addToMap = [start, end, obstacles, path];
 */
module.exports = function (start, end, obstacles, options) {
    // validation
    if (getType(start, 'start') !== 'Point') throw new Error('start must be Point');
    if (getType(end, 'end') !== 'Point') throw new Error('end must be Point');
    if (obstacles && getType(obstacles) !== 'FeatureCollection') throw new Error('obstacles must be FeatureCollection');

    // no obstacles
    if (!obstacles || obstacles.features.length === 0) return lineString([getCoord(start), getCoord(end)]);

    options = options || {};
    var units = options.units || 'kilometers';
    var resolution = options.resolution;
    if (resolution && !isNumber(resolution) || resolution <= 0) throw new Error('resolution must be a number, greater than 0');

    // define path grid area
    var collection = obstacles;
    collection.features.push(start);
    collection.features.push(end);
    var box = bbox(scale(bboxPolygon(bbox(collection)), 1.15)); // extend 15%
    if (!resolution) {
        var width = distance([box[0], box[1]], [box[2], box[1]], units);
        resolution = width / 100;
    }
    collection.features.pop();
    collection.features.pop();

    var west = box[0];
    var south = box[1];
    var east = box[2];
    var north = box[3];

    var xFraction = resolution / (distance(point([west, south]), point([east, south]), units));
    var cellWidth = xFraction * (east - west);
    var yFraction = resolution / (distance(point([west, south]), point([west, north]), units));
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
            // feed obstacles matrix
            matrixRow.push(isInsideObstacle(pt, obstacles));
            // map point's coords
            pointMatrixRow.push(currentX + '|' + currentY);
            // set closest points
            var distStart = distance(pt, start);
            if (distStart < minDistStart) {
                minDistStart = distStart;
                closestToStart = {x: c, y: r};
            }
            var distEnd = distance(pt, end);
            if (distEnd < minDistEnd) {
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

    var graph = new Graph(matrix, {diagonal: true});

    var startOnMatrix = graph.grid[closestToStart.y][closestToStart.x];
    var endOnMatrix = graph.grid[closestToEnd.y][closestToEnd.x];
    var result = astar.search(graph, startOnMatrix, endOnMatrix);

    var path = [start.geometry.coordinates];
    result.forEach(function (coord) {
        var coords = pointMatrix[coord.x][coord.y].split('|');
        path.push([+coords[0], +coords[1]]); // make sure coords are numbers
    });
    path.push(end.geometry.coordinates);

    return cleanCoords(lineString(path));
};


/**
 * Returns 0 if Point is inside any of the Polygons, 1 if isn't
 *
 * @private
 * @param {Feature<Point>} pt to check
 * @param {Array<Polygon>} polygons features
 * @returns {number} 0 if inside, 1 if not
 */
function isInsideObstacle(pt, polygons) {
    for (var i = 0; i < polygons.features.length; i++) {
        if (inside(pt, polygons.features[i])) {
            return 0;
        }
    }
    return 1;
}


function getType(geojson, name) {
    if (!geojson) throw new Error((name || 'geojson') + ' is required');
    // GeoJSON Feature & GeometryCollection
    if (geojson.geometry && geojson.geometry.type) return geojson.geometry.type;
    // GeoJSON Geometry & FeatureCollection
    if (geojson.type) return geojson.type;
    throw new Error((name || 'geojson') + ' is invalid');
}
