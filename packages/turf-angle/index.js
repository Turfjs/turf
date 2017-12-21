import bearing from '@turf/bearing';
import rhumbBearing from '@turf/rhumb-bearing';
import { isObject, bearingToAzimuth } from '@turf/helpers';

/**
 * Finds the Interior or Explementary angle between 3 points.
 *
 * @name angle
 * @param {Coord} startPoint Start Point Coordinates
 * @param {Coord} midPoint Mid Point Coordinates
 * @param {Coord} endPoint End Point Coordinates
 * @param {Object} [options={}] Optional parameters
 * @param {boolean} [options.explementary=false] Returns the explementary angle instead (360 - angle)
 * @param {boolean} [options.mercator=false] if distance should be on Mercator or WGS84 projection
 * @returns {number} Interior or Explementary angle between the 3 points.
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

    var azimuthAO = bearingToAzimuth((mercator !== true) ? bearing(A, O) : rhumbBearing(A, O));
    var azimuthBO = bearingToAzimuth((mercator !== true) ? bearing(B, O) : rhumbBearing(B, O));
    var angleAO = Math.abs(azimuthAO - azimuthBO);

    // Explementary angle
    if (explementary === true) return 360 - angleAO;
    return angleAO;
}

export default angle;
