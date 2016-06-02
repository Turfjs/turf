var destination = require('turf-destination');
var helpers = require('turf-helpers');
var polygon = helpers.polygon;


/**
 * Takes a {@link Point} and calculates the circle polygon given a radius in degrees, radians, miles, or kilometers; and steps for precision.
 *
 * @name circle
 * @param {Feature<Point>} center center point
 * @param {number} radius radius of the circle
 * @param {number} steps number of steps
 * @param {String} [units=kilometers] miles, kilometers, degrees, or radians
 * @returns {Feature<Polygon>} circle polygon
 * @example
 * var center = {
 *   "type": "Feature",
 *   "properties": {
 *     "marker-color": "#0f0"
 *   },
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [-75.343, 39.984]
 *   }
 * };
 * var radius = 5;
 * var steps = 10;
 * var units = 'kilometers';
 *
 * var circle = turf.circle(center, radius, steps, units);
 *
 * var result = {
 *   "type": "FeatureCollection",
 *   "features": [center, circle]
 * };
 *
 * //=result
 */
module.exports = function (center, radius, steps, units) {
    steps = steps || 64;
    var coordinates = [];

    for (var i = 0; i < steps; i++) {
        coordinates.push(destination(center, radius, i * 360 / steps, units).geometry.coordinates);
    }

    coordinates.push(coordinates[0]);

    return polygon([coordinates]);
};
