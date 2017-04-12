var Offset = require('polygon-offset');
var circle = require('@turf/circle');
var getCoords = require('@turf/invariant').getCoords;
var meta = require('@turf/meta');
var featureEach = meta.featureEach;
var geomEach = meta.geomEach;
var helpers = require('@turf/helpers');
var featureCollection = helpers.featureCollection;
var point = helpers.point;
var multiPolygon = helpers.multiPolygon;
var polygon = helpers.polygon;
var distanceToDegrees = helpers.distanceToDegrees;

/**
 * Calculates a buffer for input features for a given radius. Units supported are miles, kilometers, and degrees.
 *
 * @name buffer
 * @param {FeatureCollection|Feature<any>} geojson input to be buffered
 * @param {number} radius distance to draw the buffer
 * @param {string} [units='kilometers'] any of the options supported by turf units
 * @param {number} [padding=10] determines the offset padding
 * @param {number} [steps=64] number of steps
 * @returns {FeatureCollection|Feature<Polygon|MultiPolygon>} buffered features
 * @example
 * var point = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [-110, 15]
 *   }
 * };
 *
 * var buffered = turf.buffer(point, 500, 'miles');
 *
 * //addToMap
 * var addToMap = [point, buffered];
 */
module.exports = function (geojson, radius, units, padding, steps) {
    // validation
    if (radius === undefined || radius === null) throw new Error('radius is required');

    // default params
    padding = padding || 10;
    steps = steps || 64;

    var results = [];
    switch (geojson.type) {
    case 'GeometryCollection':
        geomEach(geojson, function (feature) {
            results.push(buffer(feature, radius, units, padding));
        });
        break;
    case 'FeatureCollection':
        featureEach(geojson, function (feature) {
            results.push(buffer(feature, radius, units, padding));
        });
        break;
    default:
        return buffer(geojson, radius, units, padding);
    }
    return featureCollection(results);
};

/**
 * Buffer single Feature
 *
 * @private
 * @param {Feature<any>} feature input to be buffered
 * @param {number} radius distance to draw the buffer
 * @param {string} [units='kilometers'] any of the options supported by turf units
 * @param {number} [padding=10] determines the offset padding
 * @param {number} [steps=64] number of steps
 * @returns {Feature<Polygon|MultiPolygon>} buffered feature
 */
function buffer(feature, radius, units, padding, steps) {
    var geom = (feature.geometry) ? feature.geometry.type : feature.type;
    var coords = getCoords(feature);
    var properties = feature.properties || {};
    var offset = new Offset();
    var distance = distanceToDegrees(radius, units);

    switch (geom) {
    case 'Point':
        var buffered = circle(coords, radius, steps, units);
        buffered.properties = properties;
        return buffered;
    case 'MultiPoint':
        var buffers = [];
        coords.forEach(function (coord) {
            buffers.push(getCoords(circle(point(coord, properties), radius, steps, units)));
        });
        return multiPolygon(buffers, properties);
    case 'LineString':
    case 'MultiLineString':
        var line = offset.data(coords).offsetLine(distance);
        return polygon(line, properties);
    case 'Polygon':
    case 'MultiPolygon':
        var poly = offset.data(coords).margin(distance);
        return polygon(poly, properties);
    }
}
