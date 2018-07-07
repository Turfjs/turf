import rhumbBearing from '../rhumb-bearing';
import rhumbDestination from '../rhumb-destination';
import rhumbDistance from '../rhumb-distance';
import { point, checkIfOptionsExist } from '../helpers';
import { getGeom } from '../invariant';

/**
 * Takes a {@link LineString} and returns a {@link Point} at a specified distance along the line.
 *
 * @name along
 * @param {Feature<LineString>} line input line
 * @param {number} distance distance along the line
 * @param {Object} [options] Optional parameters
 * @param {string} [options.units="kilometers"] can be degrees, radians, miles, or kilometers
 * @returns {Feature<Point>} Point `distance` `units` along the line
 * @example
 * var line = turf.lineString([[-83, 30], [-84, 36], [-78, 41]]);
 * var options = {units: 'miles'};
 *
 * var along = turf.along(line, 200, options);
 *
 * //addToMap
 * var addToMap = [along, line]
 */
export default function along(line, distance, options) {
    options = checkIfOptionsExist(options);

    const geom = getGeom(line);
    const coords = geom.coordinates;
    let travelled = 0;
    for (let i = 0; i < coords.length; i++) {
        if (distance >= travelled && i === coords.length - 1) {
            break;
        } else if (travelled >= distance) {
            const overshot = distance - travelled;
            if (!overshot) {
                return point(coords[i]);
            } else {
                const direction = rhumbBearing(coords[i], coords[i - 1]) - 180;
                const interpolated = rhumbDestination(coords[i], overshot, direction, options);
                return interpolated;
            }
        } else {
            travelled += rhumbDistance(coords[i], coords[i + 1], options);
        }
    }
    return point(coords[coords.length - 1]);
}
