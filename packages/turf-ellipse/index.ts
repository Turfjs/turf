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
import { distance } from "@turf/distance";
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
 * @param {number} [options.accuracy=3] level of precision used for the repartition of points along the curve
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
    accuracy?: number;
  }
): Feature<Polygon> {
  // Optional params
  options = options || {};
  const steps = options.steps || 64;
  const units = options.units || "kilometers";
  const angle = options.angle || 0;
  const pivot = options.pivot || center;
  const properties = options.properties || {};
  const accuracy = options.accuracy || 3;
  // validation
  if (!center) throw new Error("center is required");
  if (!xSemiAxis) throw new Error("xSemiAxis is required");
  if (!ySemiAxis) throw new Error("ySemiAxis is required");
  if (!isObject(options)) throw new Error("options must be an object");
  if (!isNumber(steps)) throw new Error("steps must be a number");
  if (!isNumber(angle)) throw new Error("angle must be a number");
  if (!isNumber(accuracy)) throw new Error("accuracy must be a number");

  const internalSteps = Math.floor(Math.pow(accuracy, 2) * steps);

  const centerCoords = getCoord(
    transformRotate(point(getCoord(center)), angle, { pivot })
  );

  const coordinates: number[][] = [];

  let r = Math.sqrt(
    (Math.pow(xSemiAxis, 2) * Math.pow(ySemiAxis, 2)) /
      (Math.pow(xSemiAxis * Math.cos(degreesToRadians(-angle)), 2) +
        Math.pow(ySemiAxis * Math.sin(degreesToRadians(-angle)), 2))
  );
  let currentCoords = getCoord(
    destination(centerCoords, r, 0, { units: units })
  );
  coordinates.push(currentCoords);

  let currentAngle = 0;
  let currentArcLength = 0;
  let previousCoords = currentCoords;
  const cumulatedArcLength = [0];
  const cumulatedAngle = [0];

  for (let i = 1; i < internalSteps + 1; i += 1) {
    previousCoords = currentCoords;
    currentAngle = (360 * i) / internalSteps;
    r = Math.sqrt(
      (Math.pow(xSemiAxis, 2) * Math.pow(ySemiAxis, 2)) /
        (Math.pow(
          xSemiAxis * Math.cos(degreesToRadians(currentAngle - angle)),
          2
        ) +
          Math.pow(
            ySemiAxis * Math.sin(degreesToRadians(currentAngle - angle)),
            2
          ))
    );
    currentCoords = getCoord(
      destination(centerCoords, r, currentAngle, { units: units })
    );
    currentArcLength += distance(previousCoords, currentCoords);
    cumulatedAngle.push(currentAngle);
    cumulatedArcLength.push(currentArcLength);
  }
  const circumference = cumulatedArcLength[cumulatedArcLength.length - 1];

  let j = 0;
  for (let i = 1; i < steps; i += 1) {
    const targetArcLength = (i * circumference) / steps;
    while (cumulatedArcLength[j] < targetArcLength) {
      j += 1;
    }
    const ratio =
      (targetArcLength - cumulatedArcLength[j - 1]) /
      (cumulatedArcLength[j] - cumulatedArcLength[j - 1]);
    const angleNewPoint =
      cumulatedAngle[j - 1] +
      ratio * (cumulatedAngle[j] - cumulatedAngle[j - 1]);

    r = Math.sqrt(
      (Math.pow(xSemiAxis, 2) * Math.pow(ySemiAxis, 2)) /
        (Math.pow(
          xSemiAxis * Math.cos(degreesToRadians(angleNewPoint - angle)),
          2
        ) +
          Math.pow(
            ySemiAxis * Math.sin(degreesToRadians(angleNewPoint - angle)),
            2
          ))
    );
    currentCoords = getCoord(
      destination(centerCoords, r, angleNewPoint, { units: units })
    );
    coordinates.push(currentCoords);
  }
  coordinates.push(coordinates[0]);
  return polygon([coordinates], properties);
}

export { ellipse };
export default ellipse;
