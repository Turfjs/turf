import destination from '@turf/destination';
import { polygon } from '@turf/helpers';

/**
 * Takes a {@link Point} and calculates the circle polygon given a radius in degrees, radians, miles, or kilometers; and steps for precision.
 *
 * @name circle
 * @param {Feature<Point>|number[]} center center point
 * @param {number} radius radius of the circle
 * @param {Object} [options={}] Optional parameters
 * @param {number} [options.steps=64] number of steps
 * @param {string} [options.units='kilometers'] miles, kilometers, degrees, or radians
 * @param {Object} [options.properties={}] properties
 * @returns {Feature<Polygon>} circle polygon
 * @example
 * var center = [-75.343, 39.984];
 * var radius = 5;
 * var options = {steps: 10, units: 'kilometers', properties: {foo: 'bar'}};
 * var circle = turf.circle(center, radius, options);
 *
 * //addToMap
 * var addToMap = [turf.point(center), circle]
 */
function circle(center, radius, options) {
    // Optional params
    options = options || {};
    var steps = options.steps || 64;
    var properties = options.properties;

    // validation
    if (!center) throw new Error('center is required');
    if (!radius) throw new Error('radius is required');
    if (typeof options !== 'object') throw new Error('options must be an object');
    if (typeof steps !== 'number') throw new Error('steps must be a number');

    // default params
    steps = steps || 64;
    properties = properties || center.properties || {};

    var coordinates = [];
    for (var i = 0; i < steps; i++) {
        coordinates.push(destination(center, radius, i * -360 / steps, options).geometry.coordinates);
    }
    coordinates.push(coordinates[0]);

    return polygon([coordinates], properties);
}

export default circle;
