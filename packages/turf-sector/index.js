var circle = require('@turf/circle');
var coordEach = require('@turf/meta').coordEach;
var helpers = require('@turf/helpers');
var getCoords = require('@turf/invariant').getCoords;
var polygon = helpers.polygon;
var lineArc = require('@turf/line-arc');

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
 * var center = turf.point([-75, 40]);
 * var radius = 5;
 * var bearing1 = 25;
 * var bearing2 = 45;
 *
 * var sector = turf.sector(center, radius, bearing1, bearing2);
 *
 * //addToMap
 * var addToMap = [center, sector];
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
    var arc = lineArc(center, radius, bearing1, bearing2, steps, units);
    var sliceCoords = [[coords]];
    coordEach(arc, function (currentCoords) {
        sliceCoords[0].push(currentCoords);
    });
    sliceCoords[0].push(coords);

    return polygon(sliceCoords);
};

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
