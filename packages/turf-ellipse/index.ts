import {
  polygon,
  isObject,
  isNumber,
  ArcApproximationMethod,
  Coord,
  Units,
  point,
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
 * @param {ArcApproximationMethod} [options.method='inscribed'] how the returned polygon approximates the ellipse: 'inscribed' places every vertex on the ellipse, 'circumscribed' places every edge tangent to the ellipse, and 'equalarea' matches the polygon's area to the ellipse's area
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
  let steps = options.steps ?? 64;
  const method = options.method ?? "inscribed";
  const units = options.units || "kilometers";
  let angle = options.angle || 0;
  const properties = options.properties || {};
  // validation
  if (!center) throw new Error("center is required");
  if (!xSemiAxis) throw new Error("xSemiAxis is required");
  if (!ySemiAxis) throw new Error("ySemiAxis is required");
  if (!isObject(options)) throw new Error("options must be an object");
  if (!isNumber(steps)) throw new Error("steps must be a number");
  if (!Number.isFinite(steps) || steps <= 0)
    throw new Error("steps must be a positive finite number");
  // a polygon needs whole vertices, and at least three of them
  steps = Math.max(3, Math.ceil(steps));
  if (!isNumber(angle)) throw new Error("angle must be a number");
  if (!["inscribed", "circumscribed", "equalarea"].includes(method))
    throw new Error(
      "method must be one of 'inscribed', 'circumscribed', 'equalarea'"
    );

  // Rotating the ellipse about a pivot other than its own center is the same
  // as rotating it in place and then moving its center about the pivot.
  const centerCoords = options.pivot
    ? getCoord(
        transformRotate(point(getCoord(center)), angle, {
          pivot: options.pivot,
        })
      )
    : getCoord(center);

  // There is deliberately a single construction for every axis ratio, with
  // no special case for near-circles: when xSemiAxis === ySemiAxis each step
  // below reduces to turf-circle's construction (vertices at bearings
  // 0, -360/n, -720/n, ... and the same circumradius for each method), so the
  // output changes continuously as an ellipse is morphed into a circle and a
  // degenerate ellipse matches circle() to within floating-point noise.

  // Parametric angles of the vertices, evenly spaced by arc length and
  // starting at the end of the y semi-axis (north, before rotation), where
  // turf-circle starts. For a circle they are evenly spaced angles.
  const params = adaptiveParams(xSemiAxis, ySemiAxis, steps);
  // the parameter after the last vertex, closing the ring
  const paramAt = (i: number) =>
    i < steps ? params[i] : params[i - steps] + 2 * Math.PI;

  // Each vertex is placed at parametric angle t and scaled by k from the
  // ellipse (x = k·a·cos t, y = k·b·sin t).
  const vertexParams: number[] = [];
  const vertexScales: number[] = [];
  if (method === "circumscribed") {
    // Every edge is tangent to the ellipse at the midpoint m_i of its two
    // vertices' parameters, and each vertex is where the tangents at m_(i-1)
    // and m_i meet. The ellipse is the unit circle stretched by (a, b), which
    // keeps tangents tangent, and on the unit circle the tangents at u and v
    // meet at angle (u + v) / 2, a distance 1 / cos((v − u) / 2) out. For a
    // circle that puts vertex i at its own angle, r / cos(π / n) out, exactly
    // like turf-circle.
    const tangentParam = (i: number) => (paramAt(i) + paramAt(i + 1)) / 2;
    for (let i = 0; i < steps; i++) {
      const before =
        i === 0 ? tangentParam(steps - 1) - 2 * Math.PI : tangentParam(i - 1);
      const after = tangentParam(i);
      vertexParams.push((before + after) / 2);
      vertexScales.push(1 / Math.cos((after - before) / 2));
    }
  } else {
    // 'inscribed' needs no scaling: every vertex lies on the ellipse.
    // 'equalarea' scales both axes by s. Vertices at (a·cos tᵢ, b·sin tᵢ)
    // enclose (a·b/2)·Σ sin(Δtᵢ), and scaling by s multiplies that by s², so
    // s²·(a·b/2)·Σ sin(Δtᵢ) = π·a·b gives s = √(2π / Σ sin(Δtᵢ)). For a
    // circle (Δt = 2π/n) that is turf-circle's equal-area circumradius ratio.
    let scale = 1;
    if (method === "equalarea") {
      let sumSinDelta = 0;
      for (let i = 0; i < steps; i++) {
        sumSinDelta += Math.sin(paramAt(i + 1) - paramAt(i));
      }
      if (sumSinDelta > 0) scale = Math.sqrt((2 * Math.PI) / sumSinDelta);
    }
    for (let i = 0; i < steps; i++) {
      vertexParams.push(params[i]);
      vertexScales.push(scale);
    }
  }

  const coords: Position[] = [];
  for (let i = 0; i < steps; i++) {
    const t = vertexParams[i];
    const k = vertexScales[i];
    // Cartesian, with x pointing east and y north
    const x = k * xSemiAxis * Math.cos(t);
    const y = k * ySemiAxis * Math.sin(t);
    // Cartesian angles run counter-clockwise from east, bearings clockwise
    // from north, so bearing = 90° − angle. Rotating the ellipse by `angle`
    // rotates every vertex's bearing.
    const bearing = 90 - (Math.atan2(y, x) * 180) / Math.PI + angle;
    coords.push(
      destination(centerCoords, Math.sqrt(x * x + y * y), bearing, { units })
        .geometry.coordinates
    );
  }
  coords.push(coords[0]);
  return polygon([coords], properties);
}

/**
 * Generate parametric angles π/2 = t₀ < t₁ < … < tₙ₋₁ < π/2 + 2π for an ellipse with
 * semi-axes a and b, spaced so that consecutive vertices are an equal arc length apart.
 * They start at the end of the b semi-axis (t = π/2) and run counter-clockwise, the
 * same start and direction as turf-circle; for a circle they are evenly spaced.
 *
 * The ellipse is densely sampled to build a cumulative arc-length table s(t), which is
 * then inverted at evenly spaced lengths. The angles are therefore strictly increasing
 * and always span exactly one revolution, so the resulting ring never self-intersects.
 * The spacing depends only on the ratio of a to b, so uniformly scaling both axes
 * afterwards leaves it unchanged.
 *
 * @private
 * @param {number} a semi-axis along x
 * @param {number} b semi-axis along y
 * @param {number} numPoints number of vertices (not including the closing point)
 * @returns {number[]} numPoints parametric angles in radians, starting at π/2
 */
function adaptiveParams(a: number, b: number, numPoints: number): number[] {
  // cumulative[j] is the arc length from t = π/2 to t = π/2 + 2πj / samples,
  // measured along the polyline through the dense samples. Four samples per
  // vertex (and at least 256) moves vertices by under 0.1% of a segment length
  // compared with much denser sampling. numPoints is a whole number, so
  // samples is always a multiple of 4 whatever numPoints is.
  const samples = Math.max(256, numPoints * 4);
  const start = Math.PI / 2;

  // The ellipse is symmetric about both axes, and with samples a multiple of 4
  // the sample grid lands exactly on the quadrant boundaries, so every sample
  // in the other three quadrants mirrors one in the first. Measure only the
  // first quadrant (t from π/2 to π), then mirror it, saving three quarters of
  // the trig calls. quadrant[r] is the arc length from π/2 to π/2 + 2πr / samples.
  // Preallocated typed arrays rather than push(): building the tables is the
  // hot loop here, and growing plain arrays roughly doubled its cost.
  const perQuadrant = samples / 4;
  const quadrant = new Float64Array(perQuadrant + 1);
  let prevX = 0;
  let prevY = b;
  for (let r = 1; r <= perQuadrant; r++) {
    const t = start + (2 * Math.PI * r) / samples;
    const x = a * Math.cos(t);
    const y = b * Math.sin(t);
    // Math.sqrt rather than Math.hypot: hypot is markedly slower in V8
    const dx = x - prevX;
    const dy = y - prevY;
    quadrant[r] = quadrant[r - 1] + Math.sqrt(dx * dx + dy * dy);
    prevX = x;
    prevY = y;
  }
  const quarter = quadrant[perQuadrant];
  // Quadrants 0 and 2 repeat the first quadrant's lengths. Quadrants 1 and 3
  // trace it in reverse (mirrored across an axis), so the length covered r
  // samples into them is what remains of the first quadrant after
  // perQuadrant − r samples.
  const cumulative = new Float64Array(samples + 1);
  for (let k = 0; k < 4; k++) {
    const offset = k * quarter;
    for (let r = 0; r < perQuadrant; r++) {
      cumulative[k * perQuadrant + r] =
        offset +
        (k % 2 === 0 ? quadrant[r] : quarter - quadrant[perQuadrant - r]);
    }
  }
  const perimeter = 4 * quarter;
  cumulative[samples] = perimeter;

  // invert s(t) at i/numPoints of the perimeter, interpolating within a sample
  const params: number[] = [start];
  let j = 0;
  for (let i = 1; i < numPoints; i++) {
    const target = (perimeter * i) / numPoints;
    while (cumulative[j + 1] < target) j++;
    const fraction =
      (target - cumulative[j]) / (cumulative[j + 1] - cumulative[j]);
    params.push(start + (2 * Math.PI * (j + fraction)) / samples);
  }

  return params;
}

export { ellipse };
export default ellipse;
