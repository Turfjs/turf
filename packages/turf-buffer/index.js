var Offset = require('polygon-offset');
var helpers = require('@turf/helpers');
var circle = require('@turf/circle');
var dissolve = require('@turf/dissolve');
var meta = require('@turf/meta');
var getCoords = require('@turf/invariant').getCoords;
var coordEach = meta.coordEach;
var featureEach = meta.featureEach;
var featureCollection = helpers.featureCollection;
var distanceToDegrees = helpers.distanceToDegrees;
var polygon = helpers.polygon;
var point = helpers.point;

/**
 * Calculates a buffer for input features for a given radius. Units supported are miles, kilometers, and degrees.
 *
 * @name buffer
 * @param {FeatureCollection|Feature<any>} feature input to be buffered
 * @param {number} radius distance to draw the buffer
 * @param {string} [units=kilometers] any of the options supported by turf units
 * @param {number} [steps=64] number of steps
 * @return {FeatureCollection|Feature<Polygon|MultiPolygon>} buffered features
 * @example
 * var point = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [-90.548630, 14.616599]
 *   }
 * };
 * var unit = 'miles';
 *
 * var buffered = turf.buffer(point, 500, unit);
 *
 * //addToMap
 * var addToMap = [point, buffered]
 */

module.exports = function (geojson, radius, units, steps) {
    // validation
    if (radius === undefined || radius === null) throw new Error('radius is required');

    // default params
    steps = steps || 64;

    switch (geojson.type) {
    case 'GeometryCollection':
    case 'FeatureCollection':
        var results = [];
        var features = (geojson.features) ? geojson.features : geojson.geometries || [];

        features.forEach(function (feature) {
            featureEach(buffer(feature, radius, units, steps), function (buffered) {
                results.push(buffered);
            });
        });
        return featureCollection(results);
    }
    return buffer(geojson, radius, units, steps);
};

/**
 * Buffer single Feature
 *
 * @private
 * @param {Feature<any>} feature input to be buffered
 * @param {number} radius distance to draw the buffer
 * @param {string} [units='kilometers'] any of the options supported by turf units
 * @param {number} [steps=64] number of steps
 * @returns {Feature<Polygon|MultiPolygon>} buffered feature
 */
function buffer(feature, radius, units, steps) {
    // validation
    if (steps <= 0) throw new Error('steps must be greater than 0');

    // default params
    var properties = feature.properties || {};
    var distance = distanceToDegrees(radius, units);
    var geometry = (feature.type === 'Feature') ? feature.geometry : feature;
    var coords = getCoords(feature);

    // Polygon-offset has issues when arcSegments is greater than 32
    var offset = new Offset(coords, (steps > 32) ? 32 : steps);

    switch (geometry.type) {
    case 'Point':
        var pointBuffer = circle(feature, radius, steps, units);
        pointBuffer.properties = properties;
        return pointBuffer;
    case 'MultiPoint':
        var polys = [];
        coordEach(feature, function (coord) {
            var poly = circle(point(coord, properties), radius, steps, units);
            poly.properties = properties;
            polys.push(poly);
        });
        return dissolve(featureCollection(polys));
    case 'LineString':
    case 'MultiLineString':
        var lineBuffer = offset.offsetLine(distance);
        return polygon(lineBuffer, properties);
    case 'Polygon':
    case 'MultiPolygon':
        var polyBuffer = offset.margin(distance);
        return polygon(polyBuffer, properties);
    default:
        throw new Error('geometry type ' + geometry.type + ' not supported');
    }
}
