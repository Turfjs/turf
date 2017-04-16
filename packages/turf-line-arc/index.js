var destination = require('@turf/destination');
var circle = require('@turf/circle');
var lineString = require('@turf/helpers').lineString;

/**
 * Creates a circular arc, of a circle of the given radius and center point, between bearing1 and bearing2;
 * 0 bearing is North of center point, positive clockwise.
 *
 * @name lineArc
 * @param {Feature<Point>} center center point
 * @param {number} radius radius of the circle
 * @param {number} bearing1 angle, in decimal degrees, of the first radius of the arc
 * @param {number} bearing2 angle, in decimal degrees, of the second radius of the arc
 * @param {number} [steps=64] number of steps
 * @param {string} [units=kilometers] miles, kilometers, degrees, or radians
 * @returns {Feature<LineString>} line arc
 * @example
 * var center = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [-75, 40]
 *   }
 * }
 * var radius = 5;
 * var bearing1 = 25;
 * var bearing2 = 47;
 *
 * var arc = turf.lineArc(center, radius, bearing1, bearing2);
 *
 * //addToMap
 * var addToMap = [center, arc]
 */
module.exports = function (center, radius, bearing1, bearing2, steps, units) {
    // validation
    if (!center) throw new Error('center is required');
    if (bearing1 === undefined || bearing1 === null) throw new Error('bearing1 is required');
    if (bearing2 === undefined || bearing2 === null) throw new Error('bearing2 is required');
    if (!radius) throw new Error('radius is required');

    // default params
    steps = steps || 64;

    var angle1 = convertAngleTo360(bearing1);
    var angle2 = convertAngleTo360(bearing2);
    var properties = center.properties;

    // handle angle parameters
    if (angle1 === angle2) {
        return lineString(circle(center, radius, steps, units).geometry.coordinates[0], properties);
    }
    var arcStartDegree = angle1;
    var arcEndDegree = (angle1 < angle2) ? angle2 : angle2 + 360;

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
    return lineString(coordinates, properties);
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
