import {
  degreesToRadians,
  polygon,
  isObject,
  isNumber,
  Coord,
  Units,
  point,
} from "@turf/helpers";
import { destination } from "@turf/destination";
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

  const centerCoords = getCoord(
    transformRotate(point(getCoord(center)), angle, { pivot })
  );

  const coordinates: number[][] = [];
  for (let i = 0; i < steps; i += 1) {
    const stepAngle = (i * -360) / steps;
    const r = Math.sqrt(
      (Math.pow(xSemiAxis, 2) * Math.pow(ySemiAxis, 2)) /
        (Math.pow(
          xSemiAxis * Math.cos(degreesToRadians(stepAngle - angle)),
          2
        ) +
          Math.pow(
            ySemiAxis * Math.sin(degreesToRadians(stepAngle - angle)),
            2
          ))
    );
    const coords = getCoord(
      destination(centerCoords, r, stepAngle, { units: units })
    );
    coordinates.push(coords);
  }
  coordinates.push(coordinates[0]);
  return polygon([coordinates], properties);
}

export { ellipse };
export default ellipse;
