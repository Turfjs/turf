import circle from '@turf/circle';
import lineArc from '@turf/line-arc';
import { coordEach } from '@turf/meta';
import { polygon, isObject } from '@turf/helpers';
import { getCoords } from '@turf/invariant';

/**
 * Creates a circular sector of a circle of given radius and center {@link Point},
 * between (clockwise) bearing1 and bearing2; 0 bearing is North of center point, positive clockwise.
 *
 * @name sector
 * @param {Coord} center center point
 * @param {number} radius radius of the circle
 * @param {number} bearing1 angle, in decimal degrees, of the first radius of the sector
 * @param {number} bearing2 angle, in decimal degrees, of the second radius of the sector
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.units='kilometers'] miles, kilometers, degrees, or radians
 * @param {number} [options.steps=64] number of steps
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
function sector(center, radius, bearing1, bearing2, options) {
    // Optional parameters
    options = options || {};
    if (!isObject(options)) throw new Error('options is invalid');

    // validation
    if (!center) throw new Error('center is required');
    if (bearing1 === undefined || bearing1 === null) throw new Error('bearing1 is required');
    if (bearing2 === undefined || bearing2 === null) throw new Error('bearing2 is required');
    if (!radius) throw new Error('radius is required');
    if (typeof options !== 'object') throw new Error('options must be an object');

    if (convertAngleTo360(bearing1) === convertAngleTo360(bearing2)) {
        return circle(center, radius, options);
    }
    var coords = getCoords(center);
    var arc = lineArc(center, radius, bearing1, bearing2, options);
    var sliceCoords = [[coords]];
    coordEach(arc, function (currentCoords) {
        sliceCoords[0].push(currentCoords);
    });
    sliceCoords[0].push(coords);

    return polygon(sliceCoords);
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
    if (beta < 0) beta += 360;
    return beta;
}

export default sector;
