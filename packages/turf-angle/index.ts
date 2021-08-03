import bearing from "@turf/bearing";
import { bearingToAzimuth, Coord, isObject } from "@turf/helpers";
import rhumbBearing from "@turf/rhumb-bearing";

/**
 * Finds the angle formed by two adjacent segments defined by 3 points. The result will be the (positive clockwise)
 * angle with origin on the `startPoint-midPoint` segment, or its explementary angle if required.
 *
 * @name angle
 * @param {Coord} startPoint Start Point Coordinates
 * @param {Coord} midPoint Mid Point Coordinates
 * @param {Coord} endPoint End Point Coordinates
 * @param {Object} [options={}] Optional parameters
 * @param {boolean} [options.explementary=false] Returns the explementary angle instead (360 - angle)
 * @param {boolean} [options.mercator=false] if calculations should be performed over Mercator or WGS84 projection
 * @returns {number} Angle between the provided points, or its explementary.
 * @example
 * turf.angle([5, 5], [5, 6], [3, 4]);
 * //=45
 */
function angle(
  startPoint: Coord,
  midPoint: Coord,
  endPoint: Coord,
  options: {
    explementary?: boolean;
    mercator?: boolean;
  } = {}
): number {
  // Optional Parameters
  if (!isObject(options)) {
    throw new Error("options is invalid");
  }

  // Validation
  if (!startPoint) {
    throw new Error("startPoint is required");
  }
  if (!midPoint) {
    throw new Error("midPoint is required");
  }
  if (!endPoint) {
    throw new Error("endPoint is required");
  }

  // Rename to shorter variables
  const A = startPoint;
  const O = midPoint;
  const B = endPoint;

  // Main
  const azimuthAO = bearingToAzimuth(
    options.mercator !== true ? bearing(A, O) : rhumbBearing(A, O)
  );
  const azimuthBO = bearingToAzimuth(
    options.mercator !== true ? bearing(B, O) : rhumbBearing(B, O)
  );
  const angleAO = Math.abs(azimuthAO - azimuthBO);

  // Explementary angle
  if (options.explementary === true) {
    return 360 - angleAO;
  }
  return angleAO;
}

export default angle;
