import { getCoord } from '@turf/invariant';
import { isObject } from '@turf/helpers';

/**
 * Finds the inner angle between 3 points.
 *
 * @name angle
 * @param {Coord} startPoint Start Point Coordinates
 * @param {Coord} midPoint Mid Point Coordinates
 * @param {Coord} endPoint End Point Coordinates
 * @param {Object} [options={}] Optional parameters
 * @param {boolean} [options.exterior=false] Returns the exterior angle instead (360 - angle)
 * @returns {number} Interior or Exterior angle between the 3 points.
 * @example
 * turf.angle([5, 5], [5, 6], [3, 4]);
 * //=45
 */
function angle(startPoint, midPoint, endPoint, options) {
    // Optional Parameters
    options = options || {};
    if (!isObject(options)) throw new Error('options is invalid');
    var exterior = options.exterior;

    // Rename to shorter variables
    var A = getCoord(startPoint);
    var B = getCoord(midPoint);
    var C = getCoord(endPoint);

    // A first point C second point B center point
    var pi = Math.PI;
    var AB = Math.sqrt(Math.pow(B[0] - A[0], 2) + Math.pow(B[1] - A[1], 2));
    var BC = Math.sqrt(Math.pow(B[0] - C[0], 2) + Math.pow(B[1] - C[1], 2));
    var AC = Math.sqrt(Math.pow(C[0] - A[0], 2) + Math.pow(C[1] - A[1], 2));
    var angle = Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB)) * (180 / pi);

    // Exterior angle
    if (exterior === true) return 360 - angle;
    return angle;
}

export default angle;
