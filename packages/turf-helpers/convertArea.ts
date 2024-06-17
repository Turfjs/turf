import type { AreaUnits } from "./AreaUnits.js";
import { areaFactors } from "./areaFactors.js";

/**
 * Converts a area to the requested unit.
 * Valid units: kilometers, kilometres, meters, metres, centimetres, millimeters, acres, miles, yards, feet, inches, hectares
 * @param {number} area to be converted
 * @param {Units} [originalUnit="meters"] of the distance
 * @param {Units} [finalUnit="kilometers"] returned unit
 * @returns {number} the converted area
 */
export function convertArea(
  area: number,
  originalUnit: AreaUnits = "meters",
  finalUnit: AreaUnits = "kilometers"
): number {
  if (!(area >= 0)) {
    throw new Error("area must be a positive number");
  }

  const startFactor = areaFactors[originalUnit];
  if (!startFactor) {
    throw new Error("invalid original units");
  }

  const finalFactor = areaFactors[finalUnit];
  if (!finalFactor) {
    throw new Error("invalid final units");
  }

  return (area / startFactor) * finalFactor;
}
