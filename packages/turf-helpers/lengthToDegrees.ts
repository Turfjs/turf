import type { Units } from "./Units.js";
import { lengthToRadians } from "./lengthToRadians.js";
import { radiansToDegrees } from "./radiansToDegrees.js";

/**
 * Convert a distance measurement (assuming a spherical Earth) from a real-world unit into degrees
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, centimeters, kilometres, feet
 *
 * @name lengthToDegrees
 * @param {number} distance in real units
 * @param {string} [units="kilometers"] can be degrees, radians, miles, inches, yards, metres,
 * meters, kilometres, kilometers.
 * @returns {number} degrees
 */
export function lengthToDegrees(distance: number, units?: Units): number {
  return radiansToDegrees(lengthToRadians(distance, units));
}
