var jsts = require('jsts');
var helpers = require('@turf/helpers');
var circle = require('@turf/circle');
var dissolve = require('@turf/dissolve');
var meta = require('@turf/meta');
var coordEach = meta.coordEach;
var featureEach = meta.featureEach;
var featureCollection = helpers.featureCollection;
var distanceToDegrees = helpers.distanceToDegrees;
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
    var properties = feature.properties || {};
    var distance = distanceToDegrees(radius, units);
    var geometry = (feature.type === 'Feature') ? feature.geometry : feature;

    switch (geometry.type) {
    case 'Point':
        var poly = circle(feature, radius, steps, units);
        poly.properties = properties;
        return poly;
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
    case 'Polygon':
    case 'MultiPolygon':
        var reader = new jsts.io.GeoJSONReader();
        var geom = reader.read(geometry);
        var buffered = geom.buffer(distance);
        var writer = new jsts.io.GeoJSONWriter();
        buffered = writer.write(buffered);
        return helpers.feature(buffered, properties);
    default:
        throw new Error('geometry type ' + geometry.type + ' not supported');
    }
}
