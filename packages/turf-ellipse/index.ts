import {
  degreesToRadians,
  polygon,
  isObject,
  isNumber,
  Coord,
  Units,
} from "@turf/helpers";
import { rhumbDestination } from "@turf/rhumb-destination";
import { transformRotate } from "@turf/transform-rotate";
import { getCoord } from "@turf/invariant";
import { GeoJsonProperties, Feature, Polygon } from "geojson";

/**
 * Takes a {@link Point} and calculates the ellipse polygon given two semi-axes expressed in variable units and steps for precision.
 *
 * @param {Coord} center center point
 * @param {number} xSemiAxis semi (major) axis of the ellipse along the x-axis
 * @param {number} ySemiAxis semi (minor) axis of the ellipse along the y-axis
 * @param {Object} [options={}] Optional parameters
 * @param {number} [options.angle=0] angle of rotation in decimal degrees, positive clockwise
 * @param {Coord} [options.pivot=center] point around which any rotation will be performed
 * @param {number} [options.steps=64] number of steps
 * @param {string} [options.units='kilometers'] unit of measurement for axes
 * @param {Object} [options.properties={}] properties
 * @returns {Feature<Polygon>} ellipse polygon
 * @example
 * var center = [-75, 40];
 * var xSemiAxis = 5;
 * var ySemiAxis = 2;
 * var ellipse = turf.ellipse(center, xSemiAxis, ySemiAxis);
 *
 * //addToMap
 * var addToMap = [turf.point(center), ellipse]
 */
function ellipse(
  center: Coord,
  xSemiAxis: number,
  ySemiAxis: number,
  options: {
    steps?: number;
    units?: Units;
    angle?: number;
    pivot?: Coord;
    properties?: GeoJsonProperties;
  }
): Feature<Polygon> {
  // Optional params
  options = options || {};
  const steps = options.steps || 64;
  const units = options.units || "kilometers";
  const angle = options.angle || 0;
  const pivot = options.pivot || center;
  const properties = options.properties || {};

  // validation
  if (!center) throw new Error("center is required");
  if (!xSemiAxis) throw new Error("xSemiAxis is required");
  if (!ySemiAxis) throw new Error("ySemiAxis is required");
  if (!isObject(options)) throw new Error("options must be an object");
  if (!isNumber(steps)) throw new Error("steps must be a number");
  if (!isNumber(angle)) throw new Error("angle must be a number");

  const centerCoords = getCoord(center);
  if (units !== "degrees") {
    const xDest = rhumbDestination(center, xSemiAxis, 90, { units });
    const yDest = rhumbDestination(center, ySemiAxis, 0, { units });
    xSemiAxis = getCoord(xDest)[0] - centerCoords[0];
    ySemiAxis = getCoord(yDest)[1] - centerCoords[1];
  }

  const coordinates: number[][] = [];
  for (let i = 0; i < steps; i += 1) {
    const stepAngle = (i * -360) / steps;
    let x =
      (xSemiAxis * ySemiAxis) /
      Math.sqrt(
        Math.pow(ySemiAxis, 2) +
          Math.pow(xSemiAxis, 2) * Math.pow(getTanDeg(stepAngle), 2)
      );
    let y =
      (xSemiAxis * ySemiAxis) /
      Math.sqrt(
        Math.pow(xSemiAxis, 2) +
          Math.pow(ySemiAxis, 2) / Math.pow(getTanDeg(stepAngle), 2)
      );

    if (stepAngle < -90 && stepAngle >= -270) x = -x;
    if (stepAngle < -180 && stepAngle >= -360) y = -y;
    if (units === "degrees") {
      const angleRad = degreesToRadians(angle);
      const newx = x * Math.cos(angleRad) + y * Math.sin(angleRad);
      const newy = y * Math.cos(angleRad) - x * Math.sin(angleRad);
      x = newx;
      y = newy;
    }

    coordinates.push([x + centerCoords[0], y + centerCoords[1]]);
  }
  coordinates.push(coordinates[0]);
  if (units === "degrees") {
    return polygon([coordinates], properties);
  } else {
    return transformRotate(polygon([coordinates], properties), angle, {
      pivot,
    });
  }
}

/**
 * Get Tan Degrees
 *
 * @private
 * @param {number} deg Degrees
 * @returns {number} Tan Degrees
 */
function getTanDeg(deg: number) {
  const rad = (deg * Math.PI) / 180;
  return Math.tan(rad);
}

export { ellipse };
export default ellipse;
