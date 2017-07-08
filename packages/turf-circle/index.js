var destination = require('@turf/destination');
var polygon = require('@turf/helpers').polygon;

/**
 * Takes a {@link Point} and calculates the circle polygon given a radius in degrees, radians, miles, or kilometers; and steps for precision.
 *
 * @name circle
 * @param {Feature<Point>|number[]} center center point
 * @param {number} radius radius of the circle
 * @param {number} [steps=64] number of steps
 * @param {string} [units=kilometers] miles, kilometers, degrees, or radians
 * @param {Object} [properties={}] properties
 * @returns {Feature<Polygon>} circle polygon
 * @example
 * var center = [-75.343, 39.984];
 * var radius = 5;
 * var steps = 10;
 * var units = 'kilometers';
 * var properties = {foo: 'bar'};
 *
 * var circle = turf.circle(center, radius, steps, units, properties);
 *
 * //addToMap
 * var addToMap = [turf.point(center), circle]
 */
module.exports = function (center, radius, steps, units, properties) {
    // validation
    if (!center) throw new Error('center is required');
    if (!radius) throw new Error('radius is required');

    // default params
    steps = steps || 64;
    properties = properties || center.properties || {};

    var coordinates = [];
    for (var i = 0; i < steps; i++) {
        coordinates.push(destination(center, radius, i * 360 / steps, units).geometry.coordinates);
    }
    coordinates.push(coordinates[0]);

    return polygon([coordinates], properties);
};
