//https://github.com/jasondavies/conrec.js
//http://stackoverflow.com/questions/263305/drawing-a-topographical-map
var tin = require('turf-tin');
var inside = require('turf-inside');
var grid = require('turf-grid');
var bbox = require('turf-bbox');
var planepoint = require('turf-planepoint');
var featurecollection = require('turf-helpers').featureCollection;
var linestring = require('turf-helpers').lineString;
var square = require('turf-square');
var Conrec = require('./conrec');

/**
 * Takes {@link Point|points} with z-values and an array of
 * value breaks and generates [isolines](http://en.wikipedia.org/wiki/Isoline).
 *
 * @name isolines
 * @param {FeatureCollection<Point>} points input points
 * @param {string} z the property name in `points` from which z-values will be pulled
 * @param {number} resolution resolution of the underlying grid
 * @param {Array<number>} breaks where to draw contours
 * @returns {FeatureCollection<LineString>} isolines
 * @example
 * // create random points with random
 * // z-values in their properties
 * var points = turf.random('point', 100, {
 *   bbox: [0, 30, 20, 50]
 * });
 * for (var i = 0; i < points.features.length; i++) {
 *   points.features[i].properties.z = Math.random() * 10;
 * }
 * var breaks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
 * var isolined = turf.isolines(points, 'z', 15, breaks);
 * //=isolined
 */
module.exports = function (points, z, resolution, breaks) {
    var tinResult = tin(points, z);
    var bboxBBox = bbox(points);
    var squareBBox = square(bboxBBox);
    var gridResult = grid(squareBBox, resolution);
    var data = [];

    for (var i = 0; i < gridResult.features.length; i++) {
        var pt = gridResult.features[i];
        for (var j = 0; j < tinResult.features.length; j++) {
            var triangle = tinResult.features[j];
            if (inside(pt, triangle)) {
                pt.properties = {};
                pt.properties[z] = planepoint(pt, triangle);
            }
        }
    }

    var depth = Math.sqrt(gridResult.features.length);
    for (var x = 0; x < depth; x++) {
        var xGroup = gridResult.features.slice(x * depth, (x + 1) * depth);
        var xFlat = [];

        for (var g = 0; g < xGroup.length; g++) {
            if (xGroup[g].properties) {
                xFlat.push(xGroup[g].properties[z]);
            } else {
                xFlat.push(0);
            }
        }
        data.push(xFlat);
    }
    var interval = (squareBBox[2] - squareBBox[0]) / depth;
    var xCoordinates = [];
    var yCoordinates = [];
    for (var d = 0; d < depth; d++) {
        xCoordinates.push(d * interval + squareBBox[0]);
        yCoordinates.push(d * interval + squareBBox[1]);
    }

    var c = new Conrec();
    c.contour(data, 0, resolution, 0, resolution, xCoordinates, yCoordinates, breaks.length, breaks);
    var contourList = c.contourList();

    var fc = featurecollection([]);
    contourList.forEach(function (c) {
        if (c.length > 2) {
            var polyCoordinates = [];
            c.forEach(function (coord) {
                polyCoordinates.push([coord.x, coord.y]);
            });
            var poly = linestring(polyCoordinates);
            poly.properties = {};
            poly.properties[z] = c.level;

            fc.features.push(poly);
        }
    });

    return fc;
};
