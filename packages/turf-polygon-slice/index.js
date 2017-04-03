var helpers = require('@turf/helpers');
var lineSplit = require('@turf/line-split');
var getCoords = require('@turf/invariant').getCoords;
var featureEach = require('@turf/meta').featureEach;
var featureCollection = helpers.featureCollection;
var lineString = helpers.lineString;

/**
 * Slices {@link Polygon} using a {@link Linestring}.
 *
 * @name polygonSlice
 * @param {Feature<Polygon>} poly Polygon to slice
 * @param {Feature<LineString>} splitter LineString used to slice Polygon
 * @returns {FeatureCollection<Polygon>} Sliced Polygons
 * @example
 * var polygon = {
 *   "geometry": {
 *     "type": "Polygon",
 *     "coordinates": [[
 *         [0, 0],
 *         [0, 10],
 *         [10, 10],
 *         [10, 0],
 *         [0, 0]
 *     ]]
 *   }
 * };
 * var linestring =  {
 *     "type": "Feature",
 *     "properties": {},
 *     "geometry": {
 *       "type": "LineString",
 *       "coordinates": [
 *         [5, 15],
 *         [5, -15]
 *       ]
 *     }
 *   }
 * var sliced = turf.polygonSlice(polygon, linestring);
 * //=sliced
*/
module.exports = function polygonSlice(poly, splitter) {
    var results = [];
    var coords = getCoords(poly);
    var outer = lineString(coords[0]);
    var inners = innerLineStrings(poly);

    // Split outers
    featureEach(lineSplit(outer, splitter), function (line) {
        results.push(line);
    });

    // Split inners
    featureEach(inners, function (inner) {
        featureEach(lineSplit(inner, splitter), function (line) {
            results.push(line);
        });
    });

    // Split splitter
    featureEach(lineSplit(splitter, poly), function (line) {
        results.push(line);
    });

    return featureCollection(results);
};

/**
 * Retrieve inner linestrings from polygon
 *
 * @private
 * @param {Feature<Polygon>} poly Feature Polygon
 * @returns {FeatureCollection<LineString>} inner lines from polygon
 */
function innerLineStrings(poly) {
    var results = [];
    var coords = getCoords(poly);
    coords.slice(1, coords.length).forEach(function (coord) {
        results.push(lineString(coord));
    });
    return featureCollection(results);
}
