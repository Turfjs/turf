const polygon = require('@turf/helpers').polygon;

/**
 * Takes a {@link Point} and calculates the ellipse polygon given two axes in degrees and steps for precision.
 *
 * @param {Feature<Point>} center center point
 * @param {number} xAxis x-axis of the ellipse
 * @param {number} yAxis y-axis of the ellipse
 * @param {Object} [options={}] Optional parameters
 * @param {number} [options.steps=64] number of steps
 * @param {Object} [options.properties={}] properties
 * @returns {Feature<Polygon>} ellipse polygon
 * @example
 * const center = turf.point([-75.343, 39.984]);
 * const xAxis = 0.5;
 * const yAxis = 0.1;
 * const options = {steps: 10, properties: {foo: 'bar'}};
 * const ellipse = turf.ellipse(center, xAxis, yAxis, options);
 *
 * //addToMap
 * const addToMap = [center, ellipse]
 */
module.exports = function (center, xAxis, yAxis, options) {
    // Optional params
    options = options || {};
    const steps = options.steps || 64;
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
        coordinates.push([x + center.geometry.coordinates[0],
            y + center.geometry.coordinates[1]
        ]);
    }
    coordinates.push(coordinates[0]);
    return polygon([coordinates], properties);
};

