import {
  polygon,
  isObject,
  isNumber,
  Coord,
  Units,
  point,
  radiansToDegrees,
} from "@turf/helpers";
import { destination } from "@turf/destination";
import { transformRotate } from "@turf/transform-rotate";
import { getCoord } from "@turf/invariant";
import { GeoJsonProperties, Feature, Polygon, Position } from "geojson";

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
  let steps = options.steps || 64;
  const units = options.units || "kilometers";
  let angle = options.angle || 0;
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

  angle = -90 + angle;

  // Divide steps by 4 for one quadrant
  steps = Math.ceil(steps / 4);

  let quadrantParameters = [];
  let parameters = [];

  const a = xSemiAxis;
  const b = ySemiAxis;

  // Gradient x intersect
  const c = b;

  // Gradient of line
  const m = (a - b) / (Math.PI / 2);

  // Area under line
  const A = ((a + b) * Math.PI) / 4;

  // Weighting function
  const v = 0.5;

  const k = steps;

  let w = 0;
  let x = 0;

  for (let i = 0; i < steps; i++) {
    x += w;

    if (m === 0) {
      // It's a circle, so use simplified c*w - A/k == 0
      w = A / k / c;
    } else {
      // Otherwise, use full (v*m)*w^2 + (m*x+c)*w - A/k == 0
      // Solve as quadratic ax^2 + bx + c = 0
      w =
        (-(m * x + c) +
          Math.sqrt(Math.pow(m * x + c, 2) - 4 * (v * m) * -(A / k))) /
        (2 * (v * m));
    }
    if (x != 0) {
      // easier to add it later to avoid having twice the same point
      quadrantParameters.push(x);
    }
  }

  //NE
  parameters.push(0);
  for (let i = 0; i < quadrantParameters.length; i++) {
    parameters.push(quadrantParameters[i]);
  }
  //NW
  parameters.push(Math.PI / 2);
  for (let i = 0; i < quadrantParameters.length; i++) {
    parameters.push(
      Math.PI - quadrantParameters[quadrantParameters.length - i - 1]
    );
  }
  //SW
  parameters.push(Math.PI);
  for (let i = 0; i < quadrantParameters.length; i++) {
    parameters.push(Math.PI + quadrantParameters[i]);
  }
  //SE
  parameters.push((3 * Math.PI) / 2);
  for (let i = 0; i < quadrantParameters.length; i++) {
    parameters.push(
      2 * Math.PI - quadrantParameters[quadrantParameters.length - i - 1]
    );
  }
  parameters.push(0);

  // We can now construct the ellipse
  const coords: Position[] = [];
  for (const param of parameters) {
    const theta = Math.atan2(b * Math.sin(param), a * Math.cos(param));
    const r = Math.sqrt(
      (Math.pow(a, 2) * Math.pow(b, 2)) /
        (Math.pow(a * Math.sin(theta), 2) + Math.pow(b * Math.cos(theta), 2))
    );
    coords.push(
      destination(centerCoords, r, angle + radiansToDegrees(theta), {
        units: units,
      }).geometry.coordinates
    );
  }
  return polygon([coords], properties);
}

export { ellipse };
export default ellipse;
