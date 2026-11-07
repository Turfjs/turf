import type {
  Feature,
  FeatureCollection,
  Geometry,
  MultiPolygon,
  Polygon,
  Position,
} from "geojson";
import { clone } from "@turf/clone";
import {
  AllGeoJSON,
  degreesToRadians,
  radiansToDegrees,
  radiansToLength,
} from "@turf/helpers";
import { geomEach } from "@turf/meta";

/**
 * Squares up a {@link Polygon} or {@link MultiPolygon}, nudging its vertices so that corners close
 * to right angles, 45° diagonals, or flat lines land on them. This is a common cleanup step
 * for building footprints traced from imagery.
 *
 * Based on Lokhat and Touya, "Enhancing building footprints with squaring operations" (JOSIS,
 * 2016).
 *
 * Each kind of corner has its own tolerance. Right angles matter most, so theirs is the widest,
 * with a 15° default drawn from cartographic practice. Flat corners get the tightest, so that a
 * curved wall drawn as a run of short segments keeps its curve. Diagonals at 45° and 135° are less
 * common, so theirs sits in between.
 *
 * Each ring is squared independently, so holes and adjacent polygons that share a wall can drift
 * apart. A ring stays unchanged if squaring would fold it, cross its edges, or fail to settle.
 *
 * Longitudes are read as plain numbers, so a ring crossing the antimeridian should run past ±180°
 * or be cut into a {@link MultiPolygon}, whose parts are squared on their own.
 *
 * @function
 * @param {FeatureCollection|Feature<Polygon|MultiPolygon>|Polygon|MultiPolygon} geojson polygons to square up. Other geometries in a FeatureCollection are copied as they are
 * @param {Object} [options={}] Optional parameters
 * @param {number} [options.toleranceDegrees=15] corners further than this from 90° are not squared, between 0 and 45
 * @param {number} [options.flatToleranceDegrees=5] corners further than this from 180° are not flattened, between 0 and 90
 * @param {number} [options.diagonalToleranceDegrees=8] corners further than this from 45° or 135° are not squared, between 0 and 22.5
 * @returns {FeatureCollection|Feature<Polygon|MultiPolygon>|Polygon|MultiPolygon} a squared copy of the input
 * @example
 * const polygon = turf.polygon([[[0, 0], [0.001, 0.00005], [0.00095, 0.001], [-0.00005, 0.00095], [0, 0]]]);
 * const squared = turf.orthogonalize(polygon);
 *
 * //addToMap
 * const addToMap = [polygon, squared];
 * squared.properties = {stroke: '#F00', 'stroke-width': 4};
 */
function orthogonalize<
  T extends
    | Feature<Polygon | MultiPolygon>
    | FeatureCollection<Geometry | null>
    | Polygon
    | MultiPolygon,
>(
  geojson: T,
  options: {
    toleranceDegrees?: number;
    flatToleranceDegrees?: number;
    diagonalToleranceDegrees?: number;
  } = {}
): T {
  // Optional parameters
  const tolerances = {
    right: options.toleranceDegrees ?? 15,
    flat: options.flatToleranceDegrees ?? 5,
    diagonal: options.diagonalToleranceDegrees ?? 8,
  };
  // Validation
  if (!(tolerances.right >= 0 && tolerances.right <= 45)) {
    throw new Error("toleranceDegrees must be between 0 and 45");
  }
  if (!(tolerances.flat >= 0 && tolerances.flat <= 90)) {
    throw new Error("flatToleranceDegrees must be between 0 and 90");
  }
  if (!(tolerances.diagonal >= 0 && tolerances.diagonal <= 22.5)) {
    throw new Error("diagonalToleranceDegrees must be between 0 and 22.5");
  }
  const result = clone(geojson as AllGeoJSON) as T;
  geomEach(result as FeatureCollection<Geometry | null>, (geometry) => {
    if (geometry?.type !== "Polygon" && geometry?.type !== "MultiPolygon") {
      if (geometry && geojson.type !== "FeatureCollection") {
        throw new Error(`${geometry.type} geometry is not supported`);
      }
      return;
    }
    for (const ring of geometry.type === "Polygon"
      ? geometry.coordinates
      : geometry.coordinates.flat()) {
      orthogonalizeRing(ring, tolerances);
    }
  });
  return result;
}

const METERS_PER_DEGREE = radiansToLength(degreesToRadians(1), "meters");
// How hard each corner pulls toward its angle, against a pull of 1 for every vertex to stay put
const CORNER_WEIGHTS = { right: 100, flat: 15, acute: 10, obtuse: 10 };
// Squaring settles once no vertex moves more than this in a round, or gives up after the cap
const CONVERGED_STEP_METERS = 1e-3;
const MAX_ROUNDS = 50;
// A squared ring with a corner narrower than this has folded, so it is rejected
const FOLDED_ANGLE_DEGREES = 0.08;

type CornerKind = keyof typeof CORNER_WEIGHTS;
type Corner = { vertex: number; kind: CornerKind };
type Tolerances = Record<"right" | "flat" | "diagonal", number>;

function orthogonalizeRing(ring: Position[], tolerances: Tolerances) {
  if (ring.length < 4) throw new Error("invalid polygon, fewer than 4 points");
  const last = ring[ring.length - 1];
  if (ring[0][0] !== last[0] || ring[0][1] !== last[1]) {
    throw new Error("invalid polygon, first and last points not equal");
  }

  // Drop repeated vertices and the closing vertex
  const vertices = ring.filter((position, i) => {
    const next = ring[(i + 1) % ring.length];
    return position[0] !== next[0] || position[1] !== next[1];
  });
  if (vertices.length < 3) return;

  // Project to meters with an equirectangular projection centered on the ring
  const meanLatitude =
    vertices.reduce((sum, [, latitude]) => sum + latitude, 0) / vertices.length;
  const metersPerDegreeLongitude =
    METERS_PER_DEGREE * Math.cos(degreesToRadians(meanLatitude));
  const original = vertices.flatMap(([longitude, latitude]) => [
    longitude * metersPerDegreeLongitude,
    latitude * METERS_PER_DEGREE,
  ]);

  // Pick the corners to square, each toward at most one target angle, right angles first. The rest
  // can still shift when their neighbors do
  const corners: Corner[] = [];
  for (let vertex = 0; vertex < vertices.length; vertex++) {
    const angle = measureAngle(original, vertex);
    if (Math.abs(angle - 90) < tolerances.right) {
      corners.push({ vertex, kind: "right" });
    } else if (angle > 180 - tolerances.flat) {
      corners.push({ vertex, kind: "flat" });
    } else if (Math.abs(angle - 45) < tolerances.diagonal) {
      corners.push({ vertex, kind: "acute" });
    } else if (Math.abs(angle - 135) < tolerances.diagonal) {
      corners.push({ vertex, kind: "obtuse" });
    }
  }
  // A ring with nothing to square keeps its exact coordinates
  if (corners.length === 0) return;

  let perimeter = 0;
  for (let i = 0; i < vertices.length; i++) {
    perimeter += measureDistance(original, i, (i + 1) % vertices.length);
  }
  const squared = squareCorners(original, corners, perimeter / vertices.length);
  if (
    !squared ||
    hasCrossingEdges(squared) ||
    vertices.some(
      (_, vertex) => measureAngle(squared, vertex) < FOLDED_ANGLE_DEGREES
    )
  ) {
    // Rings that can't be squared are returned as-is
    return;
  }

  // Unproject by applying each vertex's displacement in degrees
  vertices.forEach((position, i) => {
    position[0] +=
      (squared[2 * i] - original[2 * i]) / metersPerDegreeLongitude;
    position[1] +=
      (squared[2 * i + 1] - original[2 * i + 1]) / METERS_PER_DEGREE;
  });
  ring.splice(0, ring.length, ...vertices, vertices[0].slice());
}

/**
 * Iterated least squares adjustment. Each round linearizes the corners and solves for the step
 * that best trades squaring them against moving the vertices.
 *
 * @private
 * @param {number[]} original flat x, y coordinates in meters
 * @param {Corner[]} corners which vertices to square and how
 * @param {number} meanEdgeLength in meters, so the weights don't depend on the ring's size
 * @returns {number[]|undefined} squared coordinates, or undefined if the ring never settles
 */
function squareCorners(
  original: number[],
  corners: Corner[],
  meanEdgeLength: number
) {
  const current = original.slice();
  for (let round = 0; round < MAX_ROUNDS; round++) {
    // Each corner becomes one equation, linear near the current positions
    const linearized = corners.map(({ vertex, kind }) => ({
      ...measureResidual(current, vertex, kind, original),
      weight: CORNER_WEIGHTS[kind] * meanEdgeLength ** 2,
    }));
    // Two competing wishes: every vertex wants to return to where it started, and every corner
    // wants its residual at zero. Minimize |step - (original - current)|² + Σ weight (residual +
    // gradient · step)²
    const target = original.map((value, i) => value - current[i]);
    for (const { residual, indices, gradient, weight } of linearized) {
      for (let k = 0; k < 6; k++) {
        target[indices[k]] -= weight * residual * gradient[k];
      }
    }
    const step = conjugateGradient((vector) => {
      const product = vector.slice();
      for (const { indices, gradient, weight } of linearized) {
        let projection = 0;
        for (let k = 0; k < 6; k++) {
          projection += gradient[k] * vector[indices[k]];
        }
        for (let k = 0; k < 6; k++) {
          product[indices[k]] += weight * projection * gradient[k];
        }
      }
      return product;
    }, target);
    step.forEach((value, i) => (current[i] += value));
    if (step.every((value) => Math.abs(value) < CONVERGED_STEP_METERS)) {
      return current;
    }
  }
  return undefined;
}

/**
 * Measures the angle at a vertex.
 *
 * @private
 * @param {number[]} coordinates flat x, y coordinates
 * @param {number} vertex index of the vertex
 * @returns {number} degrees, 0 where the ring folds back on itself and 180 where it is flat
 */
function measureAngle(coordinates: number[], vertex: number) {
  const count = coordinates.length / 2;
  const previous = (vertex + count - 1) % count;
  const next = (vertex + 1) % count;
  const ux = coordinates[2 * previous] - coordinates[2 * vertex];
  const uy = coordinates[2 * previous + 1] - coordinates[2 * vertex + 1];
  const vx = coordinates[2 * next] - coordinates[2 * vertex];
  const vy = coordinates[2 * next + 1] - coordinates[2 * vertex + 1];
  return radiansToDegrees(
    Math.atan2(Math.abs(ux * vy - uy * vx), ux * vx + uy * vy)
  );
}

/**
 * Measures the distance between two vertices.
 *
 * @private
 * @param {number[]} coordinates flat x, y coordinates
 * @param {number} a index of one vertex
 * @param {number} b index of the other
 * @returns {number} distance in the coordinates' units
 */
function measureDistance(coordinates: number[], a: number, b: number) {
  return Math.hypot(
    coordinates[2 * b] - coordinates[2 * a],
    coordinates[2 * b + 1] - coordinates[2 * a + 1]
  );
}

/**
 * Measures how far a corner is from its target angle, as the dot product of its two edges (the
 * cross product for a flat corner) less the target cosine. Scaling by the edges' original lengths
 * keeps a short edge from overshooting as it shrinks.
 *
 * @private
 * @param {number[]} coordinates flat x, y coordinates
 * @param {number} vertex index of the corner's vertex
 * @param {CornerKind} kind which angle the corner is pulled toward
 * @param {number[]} reference coordinates whose edge lengths scale the residual
 * @returns {Object} residual, zero when the corner is perfect, with its gradient and the indices of
 * the three vertices' coordinates that the gradient is taken with respect to
 */
function measureResidual(
  coordinates: number[],
  vertex: number,
  kind: CornerKind,
  reference: number[]
) {
  const count = coordinates.length / 2;
  const previous = (vertex + count - 1) % count;
  const next = (vertex + 1) % count;
  // u and v are the two edges, pointing away from the corner
  const ux = coordinates[2 * previous] - coordinates[2 * vertex];
  const uy = coordinates[2 * previous + 1] - coordinates[2 * vertex + 1];
  const vx = coordinates[2 * next] - coordinates[2 * vertex];
  const vy = coordinates[2 * next + 1] - coordinates[2 * vertex + 1];
  const uLength = Math.hypot(ux, uy);
  const vLength = Math.hypot(vx, vy);
  const referenceLengths =
    measureDistance(reference, previous, vertex) *
    measureDistance(reference, vertex, next);
  const targetCosine =
    kind === "acute" ? Math.SQRT1_2 : kind === "obtuse" ? -Math.SQRT1_2 : 0;
  // The cosine barely changes near 180°, so a flat corner rotates one edge by 90° to use the sine
  const [px, py, qx, qy] =
    kind === "flat" ? [vy, -vx, -uy, ux] : [vx, vy, ux, uy];
  const dux = (px - (targetCosine * vLength * ux) / uLength) / referenceLengths;
  const duy = (py - (targetCosine * vLength * uy) / uLength) / referenceLengths;
  const dvx = (qx - (targetCosine * uLength * vx) / vLength) / referenceLengths;
  const dvy = (qy - (targetCosine * uLength * vy) / vLength) / referenceLengths;
  return {
    residual:
      (ux * px + uy * py - targetCosine * uLength * vLength) / referenceLengths,
    indices: [
      2 * previous,
      2 * previous + 1,
      2 * vertex,
      2 * vertex + 1,
      2 * next,
      2 * next + 1,
    ],
    // Moving the corner itself shifts both edges, so its gradient is minus the other two
    gradient: [dux, duy, -dux - dvx, -duy - dvy, dvx, dvy],
  };
}

/**
 * Tests whether any two edges of a ring cross each other, ignoring the shared vertex of
 * neighboring edges.
 *
 * @private
 * @param {number[]} coordinates flat x, y coordinates
 * @returns {boolean} true if two edges properly cross
 */
function hasCrossingEdges(coordinates: number[]) {
  const count = coordinates.length / 2;
  // The sign says which side of the line through a and b the point c is on
  const getSide = (a: number, b: number, c: number) =>
    (coordinates[2 * b] - coordinates[2 * a]) *
      (coordinates[2 * c + 1] - coordinates[2 * a + 1]) -
    (coordinates[2 * b + 1] - coordinates[2 * a + 1]) *
      (coordinates[2 * c] - coordinates[2 * a]);
  for (let a = 0; a < count; a++) {
    const b = (a + 1) % count;
    // Neighboring edges share a vertex, so they can't properly cross
    for (let c = a + 2; c < count; c++) {
      const d = (c + 1) % count;
      if (
        d !== a &&
        getSide(a, b, c) * getSide(a, b, d) < 0 &&
        getSide(c, d, a) * getSide(c, d, b) < 0
      ) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Solves multiply(x) = target with the conjugate gradient method, which refines a guess at x until
 * the equation balances and only ever asks the matrix to multiply a vector.
 * See https://www.cs.cmu.edu/~quake-papers/painless-conjugate-gradient.pdf
 *
 * @private
 * @param {Function} multiply applies a symmetric positive definite matrix to a vector
 * @param {number[]} target right hand side
 * @returns {number[]} x
 */
function conjugateGradient(
  multiply: (vector: number[]) => number[],
  target: number[]
) {
  const solution = target.map(() => 0);
  const imbalance = target.slice();
  const direction = target.slice();
  let imbalanceSquared = dot(imbalance, imbalance);
  for (let i = 0; i < target.length && imbalanceSquared > 1e-14; i++) {
    const product = multiply(direction);
    const stepSize = imbalanceSquared / dot(direction, product);
    for (let j = 0; j < target.length; j++) {
      solution[j] += stepSize * direction[j];
      imbalance[j] -= stepSize * product[j];
    }
    const nextImbalanceSquared = dot(imbalance, imbalance);
    const directionScale = nextImbalanceSquared / imbalanceSquared;
    for (let j = 0; j < target.length; j++) {
      direction[j] = imbalance[j] + directionScale * direction[j];
    }
    imbalanceSquared = nextImbalanceSquared;
  }
  return solution;
}

function dot(a: number[], b: number[]) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
  return sum;
}

export { orthogonalize };
export default orthogonalize;
