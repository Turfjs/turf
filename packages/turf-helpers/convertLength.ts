import type { Units } from "./Units.js";
import { lengthToRadians } from "./lengthToRadians.js";
import { radiansToLength } from "./radiansToLength.js";

/**
 * Converts a length to the requested unit.
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
 *
 * @param {number} length to be converted
 * @param {Units} [originalUnit="kilometers"] of the length
 * @param {Units} [finalUnit="kilometers"] returned unit
 * @returns {number} the converted length
 */
export function convertLength(
  length: number,
  originalUnit: Units = "kilometers",
  finalUnit: Units = "kilometers"
): number {
  if (!(length >= 0)) {
    throw new Error("length must be a positive number");
  }
  return radiansToLength(lengthToRadians(length, originalUnit), finalUnit);
}
