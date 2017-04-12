// var point = helpers.point;
// var distance = require('@turf/distance');
// var area = require('@turf/area');
// var destination = require('@turf/destination');
// var helpers = require('@turf/helpers');
// var explode = require('@turf/explode');
var inside = require('@turf/inside');
var invariant = require('@turf/invariant');
var featureEach = require('@turf/meta').featureEach;
var bbox = require('@turf/bbox');
var grid = require('@turf/point-grid');
var planepoint = require('@turf/planepoint');
var square = require('@turf/square');
var tin = require('@turf/tin');

/**
 * Takes a set of points and estimates their 'property' values on a grid.
 *
 * @name interpolate
 * @param {FeatureCollection<Point>} points a FeatureCollection of {@link Point} features
 * @param {number} cellSize the distance across each cell
 * @param {string} [property='elevation'] the property name in `points` from which z-values will be pulled
 * @param {string} [units=kilometers] miles, kilometers
 * @returns {FeatureCollection<Point>} grid of points with 'property'
 * @example
 * var center = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [-75, 40]
 *   }
 * }
 * var radius = 5;
 * var bearing1 = 25;
 * var bearing2 = 47;
 *
 * var arc = turf.lineArc(center, radius, bearing1, bearing2);
 *
 * //addToMap
 * var addToMap = [center, arc]
 */
module.exports = function (points, cellSize, property, units) {
    // validation
    if (!points) throw new Error('points is required');
    if (!cellSize) throw new Error('points is required');
    invariant.collectionOf(points, 'Point', 'input must contain Points');

    // default values
    property = property || 'elevation';

    var tinResult = tin(points, property);
    var bboxBBox = bbox(points); // [minX, minY, maxX, maxY]
    var squareBBox = square(bboxBBox);

    // cellSize = cellSize || distance(
    //         point([squareBBox[0], squareBBox[1]]),
    //         point([squareBBox[2], squareBBox[1]]),
    //         units
    //     ) / resolution;

    var gridResult = grid(squareBBox, cellSize, units, true);

    // add property value to each point of the grid
    for (var i = 0; i < gridResult.features.length; i++) {
        var pt = gridResult.features[i];
        for (var j = 0; j < tinResult.features.length; j++) {
            var triangle = tinResult.features[j];
            if (inside(pt, triangle)) {
                pt.properties = {};
                pt.properties[property] = planepoint(pt, triangle);
            } else {
                pt.properties[property] = 0;
            }
        }
    }

    // featureEach(points, function (point) {
    //     var lat = getLatitude(point);
    //     if (!unique[lat]) unique[lat] = [];
    //     unique[lat].push(point);
    // });

    return gridResult;
};
