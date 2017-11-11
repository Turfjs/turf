import {polygon, lengthToDegrees, isObject, isNumber} from '@turf/helpers';
import {getCoord} from '@turf/invariant';

/**
 * Takes a {@link Point} and calculates the ellipse polygon given two radii expressed in variable units and steps for precision.
 *
 * @param {Feature<Point>|Array<number>} center center point
 * @param {number} xRadius radius of the ellipse along the x-axis
 * @param {number} yRadius radius of the ellipse along the y-axis
 * @param {Object} [options={}] Optional parameters
 * @param {number} [options.steps=64] number of steps
 * @param {string} [options.units='kilometers'] unit of measurement for axes
 * @param {Object} [options.properties={}] properties
 * @returns {Feature<Polygon>} ellipse polygon
 * @example
 * var center = [-75, 40];
 * var xRadius = 5;
 * var yRadius = 2;
 * var ellipse = turf.ellipse(center, xRadius, yRadius);
 *
 * //addToMap
 * var addToMap = [turf.point(center), ellipse]
 */
function ellipse(center, xRadius, yRadius, options) {
    // Optional params
    options = options || {};
    var steps = options.steps || 64;
    var units = options.units || 'kilometers';
    var properties = options.properties || center.properties || {};

    // validation
    if (!center) throw new Error('center is required');
    if (!xRadius) throw new Error('xRadius is required');
    if (!yRadius) throw new Error('yRadius is required');
    if (!isObject(options)) throw new Error('options must be an object');
    if (!isNumber(steps)) throw new Error('steps must be a number');

    var centerCoords = getCoord(center);
    xRadius = lengthToDegrees(xRadius, units);
    yRadius = lengthToDegrees(yRadius, units);

    var coordinates = [];
    for (var i = 0; i < steps; i += 1) {
        var angle = i * -360 / steps;
        var x = ((xRadius * yRadius) / Math.sqrt(Math.pow(yRadius, 2) + (Math.pow(xRadius, 2) * Math.pow(getTanDeg(angle), 2))));
        var y = ((xRadius * yRadius) / Math.sqrt(Math.pow(xRadius, 2) + (Math.pow(yRadius, 2) / Math.pow(getTanDeg(angle), 2))));
        if (angle < -90 && angle >= -270) {
            x = -x;
        }
        if (angle < -180 && angle >= -360) {
            y = -y;
        }
        coordinates.push([x + centerCoords[0],
            y + centerCoords[1]
        ]);
    }
    coordinates.push(coordinates[0]);
    return polygon([coordinates], properties);
}

/**
 * Get Tan Degrees
 *
 * @private
 * @param {number} deg Degrees
 * @returns {number} Tan Degrees
 */
function getTanDeg(deg) {
    var rad = deg * Math.PI / 180;
    return Math.tan(rad);
}

export default ellipse;
