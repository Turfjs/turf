const polygon = require('@turf/helpers').polygon;
const lengthToDegrees = require('@turf/helpers').lengthToDegrees;
const getCoord = require('@turf/invariant').getCoord;

/**
 * Takes a {@link Point} and calculates the ellipse polygon given two axes in degrees and steps for precision.
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
 * const center = [-75.9975, 40.730833];
 * const xRadius = 0.5;
 * const yRadius = 0.1;
 * const options = {steps: 10, properties: {foo: 'bar'}};
 * const ellipse = turf.ellipse(center, xRadius, yRadius, options);
 *
 * //addToMap
 * const addToMap = [turf.point(center), ellipse]
 */
module.exports = function (center, xRadius, yRadius, options) {
    // Optional params
    options = options || {};
    const steps = options.steps || 64;
    const units = options.units || 'kilometers';
    const properties = options.properties || center.properties || {};

    // helper function
    const getTanDeg = function (deg) {
        const rad = deg * Math.PI / 180;
        return Math.tan(rad);
    };

    // validation
    if (!center) throw new Error('center is required');
    if (!xRadius) throw new Error('xRadius is required');
    if (!yRadius) throw new Error('yRadius is required');
    if (typeof options !== 'object') throw new Error('options must be an object');
    if (typeof steps !== 'number') throw new Error('steps must be a number');

    const centerCoords = getCoord(center);
    xRadius = lengthToDegrees(xRadius, units);
    yRadius = lengthToDegrees(yRadius, units);

    let coordinates = [];
    for (let i = 0; i < steps; i += 1) {
        const angle = i * -360 / steps;
        let x = ((xRadius * yRadius) / Math.sqrt(Math.pow(yRadius, 2) + (Math.pow(xRadius, 2) * Math.pow(getTanDeg(angle), 2))));
        let y = ((xRadius * yRadius) / Math.sqrt(Math.pow(xRadius, 2) + (Math.pow(yRadius, 2) / Math.pow(getTanDeg(angle), 2))));
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
};

