var meta = require('@turf/meta');
var Offset = require('polygon-offset');
var circle = require('@turf/circle');
var helpers = require('@turf/helpers');
var dissolve = require('@turf/dissolve');
var getCoords = require('@turf/invariant').getCoords;
var point = helpers.point;
var polygon = helpers.polygon;
var coordEach = meta.coordEach;
var featureEach = meta.featureEach;
var featureCollection = helpers.featureCollection;
var distanceToDegrees = helpers.distanceToDegrees;

/**
 * Calculates a buffer for input features for a given radius. Units supported are miles, kilometers, and degrees.
 *
 * @name buffer
 * @param {FeatureCollection|Geometry|Feature<any>} feature input to be buffered
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
 * @param {Geometry|Feature<any>} geojson input to be buffered
 * @param {number} radius distance to draw the buffer
 * @param {string} [units='kilometers'] any of the options supported by turf units
 * @param {number} [steps=64] number of steps
 * @returns {Feature<Polygon|MultiPolygon>} buffered feature
 */
function buffer(geojson, radius, units, steps) {
    // validation
    if (!geojson) throw new Error('geojson is required');
    if (radius === undefined || radius === null) throw new Error('radius is required');
    if (steps <= 0) throw new Error('steps must be greater than 0');

    // default params
    var properties = geojson.properties || {};
    var distance = distanceToDegrees(radius, units);
    var coords = getCoords(geojson);
    var type = (geojson.geometry) ? geojson.geometry.type : geojson.type;

    switch (type) {
    case 'Point':
        var pointBuffer = circle(coords, radius, steps, units);
        pointBuffer.properties = properties;
        return pointBuffer;
    case 'MultiPoint':
        var polys = [];
        coordEach(geojson, function (coord) {
            var poly = circle(point(coord, properties), radius, steps, units);
            poly.properties = properties;
            polys.push(poly);
        });
        return dissolve(featureCollection(polys));
    case 'LineString':
    case 'MultiLineString':
        var lineOffset = new Offset(coords, steps);
        var lineBuffer = lineOffset.offsetLine(distance);
        return polygon(lineBuffer, properties);
    case 'Polygon':
    case 'MultiPolygon':
        // Polygon-offset has issues when arcSegments is greater than 32
        var polyOffset = new Offset(coords, (steps > 32) ? 32 : steps);
        var polyBuffer = polyOffset.margin(distance);
        return polygon(polyBuffer, properties);
    }
}
