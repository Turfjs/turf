import { getCoord } from '@turf/invariant';

/**
 * Finds the angle between 3 points.
 *
 * @param {Coord} startPoint Start Point Coordinates
 * @param {Coord} midPoint Mid Point Coordinates
 * @param {Coord} endPoint End Point Coordinates
 * @returns {number} angle
 * @example
 * turf.angle([5, 5], [5, 6], [3, 4])
 * //=45
 */
export default function (startPoint, midPoint, endPoint) {
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
    return angle;
}
