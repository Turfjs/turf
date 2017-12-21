import bearing from '@turf/bearing';
import rhumbBearing from '@turf/rhumb-bearing';
import { isObject, bearingToAzimuth } from '@turf/helpers';

/**
 * Finds the inner angle between 3 points.
 *
 * @name angle
 * @param {Coord} startPoint Start Point Coordinates
 * @param {Coord} midPoint Mid Point Coordinates
 * @param {Coord} endPoint End Point Coordinates
 * @param {Object} [options={}] Optional parameters
 * @param {boolean} [options.explementary=false] Returns the explementary angle instead (360 - angle)
 * @returns {number} Interior or Exterior angle between the 3 points.
 * @example
 * turf.angle([5, 5], [5, 6], [3, 4]);
 * //=45
 */
function angle(startPoint, midPoint, endPoint, options) {
    // Optional Parameters
    options = options || {};
    if (!isObject(options)) throw new Error('options is invalid');
    var explementary = options.explementary;
    var mercator = options.mercator;

    // Rename to shorter variables
    var A = startPoint;
    var O = midPoint;
    var B = endPoint;

    var azimuthOA = bearingToAzimuth((mercator !== true) ? bearing(O, A) : rhumbBearing(O, A));
    var azimuthOB = bearingToAzimuth((mercator !== true) ? bearing(O, B) : rhumbBearing(O, B));
    var angleO = Math.abs(azimuthOA - azimuthOB);

    // Explementary angle
    if (explementary === true) return 360 - angleO;
    return angleO;
}

export default angle;
