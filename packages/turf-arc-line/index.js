var destination = require('@turf/destination');
var circle = require('@turf/circle');
var line = require('@turf/helpers').lineString;

/**
 * Creates a circular arc, of a circle of the given radius and center point, between bearing1 and bearing2;
 * 0 bearing is North of center point, positive clockwise.
 *
 * @name arc-line
 * @param {Feature<Point>} center center point
 * @param {number} radius radius of the circle
 * @param {number} bearing1 angle, in decimal degrees, of the first radius of the arc
 * @param {number} bearing2 angle, in decimal degrees, of the second radius of the arc
 * @param {number} [steps=64] number of steps
 * @param {string} [units=kilometers] miles, kilometers, degrees, or radians
 * @returns {Feature<LineString>} arc line
 * @example
 * var center = turf.point([-75.343, 39.984]);
 * var radius = 5;
 * var bearing1 = 25;
 * var bearing2 = 47;
 * var steps = 30;
 * var units = 'kilometers';
 *
 * var sector = turf.arcLine(center, radius, bearing1, bearing2, steps, units);
 *
 * //=arc
 */
module.exports = function (center, radius, bearing1, bearing2, steps, units) {

    // validation
    if (!center || bearing1 === undefined || bearing2 === undefined || !radius) {
        throw new Error('Missing required parameter(s) for arc-line');
    }
    steps = steps || 64;

    var angle1 = convertAngleTo360(bearing1);
    var angle2 = convertAngleTo360(bearing2);
    var arcStartDegree, arcEndDegree;

    // handle angle parameters
    if (angle1 === angle2) {
        return circle(center, radius, steps, units);
    } else if (angle1 < angle2) {
        arcStartDegree = angle1;
        arcEndDegree = angle2;
    } else {
        arcStartDegree = angle2;
        arcEndDegree = angle1;
    }

    var alfa = arcStartDegree;
    var coordinates = [];
    var i = 0;

    while (alfa < arcEndDegree) {
        coordinates.push(destination(center, radius, alfa, units).geometry.coordinates);
        i++;
        alfa = arcStartDegree + i * 360 / steps;
    }
    if (alfa > arcEndDegree) {
        coordinates.push(destination(center, radius, arcEndDegree, units).geometry.coordinates);
    }
    return line(coordinates);
};


/**
 * Takes any angle in  degrees
 * and returns a valid angle between 0-360 degrees
 *
 * @private
 * @param {number} alfa angle between -180-180 degrees
 * @returns {number} angle between 0-360 degrees
 */
function convertAngleTo360(alfa) {
    var beta = alfa % 360;
    if (beta < 0) {
        beta += 360;
    }
    return beta;
}
