import {
  degreesToRadians,
  polygon,
  isObject,
  isNumber,
  Coord,
  Units,
  point,
  lineString,
} from "@turf/helpers";
import { rhumbBearing } from "@turf/rhumb-bearing";
import { rhumbDestination } from "@turf/rhumb-destination";
import { destination } from "@turf/destination";
import { distance } from "@turf/distance";
import { transformRotate } from "@turf/transform-rotate";
import { getCoord } from "@turf/invariant";
import { GeoJsonProperties, Feature, Polygon, Point, Position } from "geojson";

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
  let steps = options.steps || 64;
  const units = options.units || "kilometers";
  const angle = options.angle || 0;
  const pivot = options.pivot || center;
  const properties = options.properties || {};
  const accuracy = options.accuracy === undefined ? 0 : options.accuracy;
  // validation
  if (!center) throw new Error("center is required");
  if (!xSemiAxis) throw new Error("xSemiAxis is required");
  if (!ySemiAxis) throw new Error("ySemiAxis is required");
  if (!isObject(options)) throw new Error("options must be an object");
  if (!isNumber(steps)) throw new Error("steps must be a number");
  if (!isNumber(angle)) throw new Error("angle must be a number");
  if (!isNumber(accuracy)) throw new Error("accuracy must be a number");
  if (accuracy !== 0 && accuracy < 1)
    throw new Error(
      "accuracy must either be equal to -1 or greater or equal to 1"
    );

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
  let circumference = 0;
  if (accuracy != 0) {
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
    circumference = cumulatedArcLength[cumulatedArcLength.length - 1];
  }

  let j = 0;
  for (let i = 1; i < steps; i += 1) {
    let angleNewPoint = (360 * i) / steps;
    if (accuracy != 0) {
      const targetArcLength = (i * circumference) / steps;
      while (cumulatedArcLength[j] < targetArcLength) {
        j += 1;
      }
      const ratio =
        (targetArcLength - cumulatedArcLength[j - 1]) /
        (cumulatedArcLength[j] - cumulatedArcLength[j - 1]);
      angleNewPoint =
        cumulatedAngle[j - 1] +
        ratio * (cumulatedAngle[j] - cumulatedAngle[j - 1]);
    }
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

function ellipseRiemann(
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

  let r = Math.sqrt(
    (Math.pow(xSemiAxis, 2) * Math.pow(ySemiAxis, 2)) /
      (Math.pow(xSemiAxis * Math.cos(degreesToRadians(-angle)), 2) +
        Math.pow(ySemiAxis * Math.sin(degreesToRadians(-angle)), 2))
  );
  let currentCoords = getCoord(
    destination(centerCoords, r, 0, { units: units })
  );
  coordinates.push(currentCoords);

  // Divide steps by 4 for one quadrant
  steps = steps / 4;
  steps = 10;

  let quadrant: Position[] = [];

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

  for (let i = 0; i <= steps; i++) {
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

    // console.log("Aw", v * m * Math.pow(w, 2) + (m * x + c) * w);

    // Scale x (between 0 and PI/2) up to the length of the xSemiAxis
    const scaleX = (x / (Math.PI / 2)) * a;

    // x^2 / a^2 + y^2 / b^2 = 1, solve for y
    const y = Math.sqrt(
      (1 - Math.pow(scaleX, 2) / Math.pow(a, 2)) * Math.pow(b, 2)
    );

    // console.log("scaleX", scaleX, y);
    const dist = Math.sqrt(Math.pow(scaleX, 2) + Math.pow(y, 2));
    const baseAngle =
      (Math.atan(Math.abs(y) / Math.abs(scaleX)) * 180) / Math.PI;
    quadrant.push([scaleX, y, baseAngle, dist]);

    console.log(scaleX);
  }

  // Add final point which is just [a, 0]
  // const dist = Math.sqrt(Math.pow(a, 2) + Math.pow(0, 2));
  // const baseAngle = (Math.atan(Math.abs(0) / Math.abs(a)) * 180) / Math.PI;
  // quadrant.push([a, 0, baseAngle, dist]);

  // console.log(JSON.stringify(quadrant));
  const geometricPoints: Position[] = [];
  const geodesicPoints: Position[] = [];

  // Push the quadrant forwards, with x values negated (NW quadrant)
  for (const pt of quadrant) {
    const [baseAngle, dist] = [pt[2], pt[3]];
    const bearing = 0 - (90 - baseAngle);
    geodesicPoints.push(
      destination(center, dist, bearing).geometry.coordinates
    );
    geometricPoints.push([-pt[0], pt[1]]);
  }

  // Push the quadrant backwards, with x and y values negated (SW quadrant)
  quadrant.reverse();
  for (const pt of quadrant) {
    const [baseAngle, dist] = [pt[2], pt[3]];
    const bearing = -90 - baseAngle;
    geodesicPoints.push(
      destination(center, dist, bearing).geometry.coordinates
    );
    geometricPoints.push([-pt[0], -pt[1]]);
  }

  // Push the quadrant forwards, with y values negated (SE quadrant)
  quadrant.reverse();
  for (const pt of quadrant) {
    const [baseAngle, dist] = [pt[2], pt[3]];
    const bearing = 180 - (90 - baseAngle);
    geodesicPoints.push(
      destination(center, dist, bearing).geometry.coordinates
    );
    geometricPoints.push([pt[0], -pt[1]]);
  }

  // Push the quadrant backwards, verbatim (NE quadrant)
  quadrant.reverse();
  for (const pt of quadrant) {
    const [baseAngle, dist] = [pt[2], pt[3]];
    const bearing = 90 - baseAngle;
    geodesicPoints.push(
      destination(center, dist, bearing).geometry.coordinates
    );
    geometricPoints.push([pt[0], pt[1]]);
  }

  console.log(JSON.stringify(lineString(geometricPoints)));

  return polygon([geodesicPoints], properties);
}

function ellipseOld(
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

export { ellipse, ellipseOld, ellipseRiemann };
export default ellipse;
