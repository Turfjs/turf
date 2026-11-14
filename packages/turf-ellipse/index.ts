import {
  polygon,
  isObject,
  isNumber,
  calculatePolygonCircumRadius,
  ArcApproximationMethod,
  Coord,
  Units,
} from "@turf/helpers";
import { destination } from "@turf/destination";
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
 * @param {ArcApproximationMethod} [options.method='equalarea'] how the returned polygon approximates the ellipse: 'inscribed' places every vertex on the ellipse, 'circumscribed' scales every vertex outward from the ellipse, and 'equalarea' matches the polygon's area to the ellipse's area
 * @param {Units} [options.units='kilometers'] unit of measurement for axes. Supports all valid Turf {@link https://turfjs.org/docs/api/types/Units Units}
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
    method?: ArcApproximationMethod;
    units?: Units;
    angle?: number;
    pivot?: Coord;
    properties?: GeoJsonProperties;
  }
): Feature<Polygon> {
  // Optional params
  options = options || {};
  let steps = options.steps || 64;
  const method = options.method || "equalarea";
  const units = options.units || "kilometers";
  let angle = options.angle || 0;
  const properties = options.properties || {};
  // validation
  if (!center) throw new Error("center is required");
  if (!xSemiAxis) throw new Error("xSemiAxis is required");
  if (!ySemiAxis) throw new Error("ySemiAxis is required");
  if (!isObject(options)) throw new Error("options must be an object");
  if (!isNumber(steps)) throw new Error("steps must be a number");
  if (!isNumber(angle)) throw new Error("angle must be a number");

  const centerCoords = getCoord(center);

  /**
   * Generate ellipse coordinates with adaptive arc-length spacing.
   *
   * For circles: uses uniform bearings (matches turf-circle exactly)
   * For ellipses: uses adaptive parametric angles to approximate even arc-length distribution
   *
   * The angle parameter rotates the entire ellipse orientation (not just the starting point).
   *
   * @param a - semi-major axis (x-axis)
   * @param b - semi-minor axis (y-axis)
   * @param numPoints - number of vertices to generate (not including closing point)
   * @param params - parametric angles to place ellipse vertices at (ignored for circles)
   * @returns array of [lon, lat] coordinates
   */
  const constructCoords = (
    a: number,
    b: number,
    numPoints: number,
    params: number[]
  ): Position[] => {
    const coords: Position[] = [];
    const eccentricity = Math.sqrt(
      1 - Math.pow(Math.min(a, b) / Math.max(a, b), 2)
    );
    const isCircle = eccentricity < 0.01;

    // For circles, use uniform bearings to match turf-circle exactly
    // BUT start from the east point (like ellipses) for smooth transition
    if (isCircle) {
      for (let i = 0; i < numPoints; i++) {
        // Start from bearing=90° (east) to match ellipse starting point
        const bearing = 90 + angle + (i * -360) / numPoints;
        coords.push(
          destination(centerCoords, a, bearing, {
            units: units,
          }).geometry.coordinates
        );
      }
      coords.push(coords[0]);
      return coords;
    }

    // For ellipses, use the adaptive parametric angles (even arc-length spacing)
    // Convert parametric angles to geographic coordinates
    for (const param of params) {
      // Parametric ellipse: x = a*cos(t), y = b*sin(t)
      // This is in Cartesian coords with 0° = east

      // Convert to polar form to get radius and angle
      const x = a * Math.cos(param);
      const y = b * Math.sin(param);
      const r = Math.sqrt(x * x + y * y);

      // Convert Cartesian angle to geographic bearing
      // Cartesian: 0°=east, 90°=north, counter-clockwise
      // Geographic: 0°=north, 90°=east, clockwise
      // bearing = 90 - cartesianAngle (for standard position)
      const cartesianAngle = Math.atan2(y, x);
      const bearing = 90 - (cartesianAngle * 180) / Math.PI;

      // Apply the user's rotation angle
      const rotatedBearing = bearing + angle;

      coords.push(
        destination(centerCoords, r, rotatedBearing, {
          units: units,
        }).geometry.coordinates
      );
    }

    coords.push(coords[0]);
    return coords;
  };

  /**
   * Determine if this is a circle (or very close to one)
   */
  const eccentricity = Math.sqrt(
    1 -
      Math.pow(
        Math.min(xSemiAxis, ySemiAxis) / Math.max(xSemiAxis, ySemiAxis),
        2
      )
  );

  /**
   * Calculate the scaling factor to apply to both semi-axes so that the constructed
   * polygon approximates the ellipse according to `method`.
   *
   * Near-circular ellipses use uniform spacing, so turf-circle's circumradius-to-radius
   * ratio applies directly (passing a unit circleRadius of 1 yields that ratio).
   *
   * Actual ellipses use adaptive, non-uniform parameter spacing, so for `equalarea` the
   * polygon's area is computed analytically instead: vertices at (a·cos tᵢ, b·sin tᵢ)
   * enclose (a·b/2)·Σ sin(Δtᵢ), and scaling both axes by s multiplies that by s². Solving
   * s²·(a·b/2)·Σ sin(Δtᵢ) = π·a·b gives s = √(2π / Σ sin(Δtᵢ)). For uniform spacing this
   * reduces to the same ratio turf-circle uses.
   */
  // Use steps directly as the number of points
  const numPoints = steps;
  const isCircle = eccentricity < 0.01;
  const params = isCircle
    ? []
    : adaptiveParams(xSemiAxis, ySemiAxis, numPoints);

  let scaleFactor = calculatePolygonCircumRadius(1, numPoints, method);

  if (method === "equalarea" && !isCircle) {
    let sumSinDelta = 0;
    for (let i = 0; i < params.length; i++) {
      // the final segment closes the ring back to params[0] (= 0, i.e. 2π)
      const next = i + 1 < params.length ? params[i + 1] : 2 * Math.PI;
      sumSinDelta += Math.sin(next - params[i]);
    }
    if (sumSinDelta > 0) {
      scaleFactor = Math.sqrt((2 * Math.PI) / sumSinDelta);
    }
  }

  const a1 = xSemiAxis * scaleFactor;
  const b1 = ySemiAxis * scaleFactor;

  const coords1: Position[] = constructCoords(a1, b1, numPoints, params);
  return polygon([coords1], properties);
}

/**
 * Generate parametric angles t₀ = 0 < t₁ < … for an ellipse with semi-axes a and b,
 * spaced to approximate an even arc-length distribution of numPoints vertices.
 *
 * The spacing depends only on the ratio of a to b (apart from a small-derivative guard),
 * so uniformly scaling both axes afterwards leaves it unchanged.
 *
 * @private
 * @param {number} a semi-axis along x
 * @param {number} b semi-axis along y
 * @param {number} numPoints number of vertices (not including the closing point)
 * @returns {number[]} numPoints parametric angles in radians, starting at 0
 */
function adaptiveParams(a: number, b: number, numPoints: number): number[] {
  // Estimate total perimeter using Ramanujan's approximation
  const h = Math.pow((a - b) / (a + b), 2);
  const perimeter =
    Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
  const targetSegmentLength = perimeter / numPoints;

  let currentParam = 0;
  const params: number[] = [0];

  // Generate adaptive parameters using iterative arc-length approximation
  for (let i = 1; i < numPoints; i++) {
    // Start with uniform increment as initial guess
    let deltaParam = (2 * Math.PI) / numPoints;

    // Refine using Newton-Raphson iterations to match target arc-length
    // Arc-length derivative: ds/dt = sqrt(a²sin²(t) + b²cos²(t))
    for (let iter = 0; iter < 5; iter++) {
      const midParam = currentParam + deltaParam / 2;
      const sinMid = Math.sin(midParam);
      const cosMid = Math.cos(midParam);
      const arcLengthDerivative = Math.sqrt(
        a * a * sinMid * sinMid + b * b * cosMid * cosMid
      );

      // Estimate arc-length for this parameter increment
      if (arcLengthDerivative > 0.001) {
        const estimatedLength = arcLengthDerivative * deltaParam;
        // Adjust parameter increment to match target segment length
        const correction = targetSegmentLength / estimatedLength;
        deltaParam *= correction;

        // Clamp to prevent overshooting
        deltaParam = Math.max(
          (Math.PI / 180) * 0.5, // min 0.5°
          Math.min((Math.PI / 180) * 120, deltaParam) // max 120°
        );
      }
    }

    currentParam += deltaParam;
    params.push(currentParam);
  }

  return params;
}

export { ellipse };
export default ellipse;
