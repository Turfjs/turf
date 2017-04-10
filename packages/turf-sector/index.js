var destination = require('@turf/destination');
var circle = require('@turf/circle');
var coordEach = require('@turf/meta').coordEach;
var helpers = require('@turf/helpers');
var getCoords = require('@turf/invariant').getCoords;
var polygon = helpers.polygon;
var line = helpers.lineString;

/**
 * Creates a circular sector of a circle of given radius and center {@link Point},
 * between (clockwise) bearing1 and bearing2; 0 bearing is North of center point, positive clockwise.
 *
 * @name sector
 * @param {Feature<Point>} center center point
 * @param {number} radius radius of the circle
 * @param {number} bearing1 angle, in decimal degrees, of the first radius of the sector
 * @param {number} bearing2 angle, in decimal degrees, of the second radius of the sector
 * @param {number} [steps=64] number of steps
 * @param {string} [units=kilometers] miles, kilometers, degrees, or radians
 * @returns {Feature<Polygon>} sector polygon
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
 * var bearing2 = 45;
 *
 * var sector = turf.sector(center, radius, bearing1, bearing2);
 *
 * //addToMap
 * var addToMap = [center, sector]
 */
module.exports = function (center, radius, bearing1, bearing2, steps, units) {
    // validation
    if (!center) throw new Error('center is required');
    if (bearing1 === undefined || bearing1 === null) throw new Error('bearing1 is required');
    if (bearing2 === undefined || bearing2 === null) throw new Error('bearing2 is required');
    if (!radius) throw new Error('radius is required');

    // default params
    steps = steps || 64;

    if (convertAngleTo360(bearing1) === convertAngleTo360(bearing2)) {
        return circle(center, radius, steps, units);
    }
    var coords = getCoords(center);
    var arc = getArcLine(center, radius, bearing1, bearing2, steps, units);
    var sliceCoords = [[coords]];
    coordEach(arc, function (currentCoords) {
        sliceCoords[0].push(currentCoords);
    });
    sliceCoords[0].push(coords);

    return polygon(sliceCoords);
};

/**
 * Returns a circular arc, of a circle of the given radius, between angle1 and angle2
 *
 * @private
 * @param {Feature<Point>} center center point of the originating circle
 * @param {number} radius radius of the circle
 * @param {number} angle1 angle, in decimal degrees, delimiting the arc
 * @param {number} angle2 angle, in decimal degrees, delimiting the arc
 * @param {number} [steps=64] number of steps
 * @param {string} [units=kilometers] miles, kilometers, degrees, or radians
 * @returns {LineString} circular arc
 */
function getArcLine(center, radius, angle1, angle2, steps, units) {
    angle1 = convertAngleTo360(angle1);
    angle2 = convertAngleTo360(angle2);
    var coordinates = [];
    var alfa =  angle1;
    var i = 0;

    while (alfa < angle2) {
        coordinates.push(destination(center, radius, alfa, units).geometry.coordinates);
        i++;
        alfa = angle1 + i * 360 / steps;
    }
    if (alfa > angle2) {
        coordinates.push(destination(center, radius, angle2, units).geometry.coordinates);
    }
    return line(coordinates);
}

/**
 * Takes any angle in degrees
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
