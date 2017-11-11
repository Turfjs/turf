const polygon = require('@turf/helpers').polygon;
const lengthToDegrees = require('@turf/helpers').lengthToDegrees;
const getCoord = require('@turf/invariant').getCoord;

/**
 * Takes a {@link Point} and calculates the ellipse polygon given two axes in degrees and steps for precision.
 *
 * @param {Feature<Point>|Array<number>} center center point
 * @param {number} xAxis x-axis of the ellipse
 * @param {number} yAxis y-axis of the ellipse
 * @param {Object} [options={}] Optional parameters
 * @param {number} [options.steps=64] number of steps
 * @param {string} [options.units='kilometers'] unit of measurement for axes
 * @param {Object} [options.properties={}] properties
 * @returns {Feature<Polygon>} ellipse polygon
 * @example
 * const center = [-75.9975, 40.730833];
 * const xAxis = 0.5;
 * const yAxis = 0.1;
 * const options = {steps: 10, properties: {foo: 'bar'}};
 * const ellipse = turf.ellipse(center, xAxis, yAxis, options);
 *
 * //addToMap
 * const addToMap = [turf.point(center), ellipse]
 */
module.exports = function (center, xAxis, yAxis, options) {
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
    if (!xAxis) throw new Error('xAxis is required');
    if (!yAxis) throw new Error('yAxis is required');
    if (typeof options !== 'object') throw new Error('options must be an object');
    if (typeof steps !== 'number') throw new Error('steps must be a number');

    const centerCoords = getCoord(center);
    xAxis = lengthToDegrees(xAxis, units);
    yAxis = lengthToDegrees(yAxis, units);

    let coordinates = [];
    for (let i = 0; i < steps; i += 1) {
        const angle = i * -360 / steps;
        let x = ((xAxis * yAxis) / Math.sqrt(Math.pow(yAxis, 2) + (Math.pow(xAxis, 2) * Math.pow(getTanDeg(angle), 2))));
        let y = ((xAxis * yAxis) / Math.sqrt(Math.pow(xAxis, 2) + (Math.pow(yAxis, 2) / Math.pow(getTanDeg(angle), 2))));
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

