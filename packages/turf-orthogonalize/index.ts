import type {
  Feature,
  FeatureCollection,
  GeoJSON,
  Geometry,
  MultiPolygon,
  Polygon,
  Position,
} from "geojson";
import { clone } from "@turf/clone";
import {
  AllGeoJSON,
  degreesToRadians,
  polygon,
  radiansToDegrees,
  radiansToLength,
  removeBbox,
} from "@turf/helpers";
import { geomEach } from "@turf/meta";

/**
 * Squares up a {@link Polygon} or {@link MultiPolygon}, nudging its vertices so that corners close
 * to right angles, 45° diagonals, or flat lines land on them. This is a common cleanup step
 * for building footprints traced from imagery.
 *
 * Based on Lokhat and Touya, "Enhancing building footprints with squaring operations", Journal of
 * Spatial Information Science 13 (2016), pages 33 to 60.
 * DOI https://doi.org/10.5311/JOSIS.2016.13.276
 * PDF https://hal.science/hal-02147792/document
 *
 * Each kind of corner has its own tolerance. Right angles matter most, so theirs is the widest,
 * with a 15° default drawn from cartographic practice. Flat corners get the tightest, so that a
 * curved wall drawn as a run of short segments keeps its curve. Diagonals at 45° and 135° are less
 * common, so theirs sits in between.
 *
 * Each ring is squared independently, so holes and adjacent polygons that share a wall can drift
 * apart. An edge far shorter than the rest is merged away.
 * A ring stays unchanged if squaring would fold it, cross its edges, collapse a wall, push it past
 * a pole, or fail to settle. A polygon stays unchanged if squaring would make its rings cross or
 * push a hole outside, and a {@link MultiPolygon} stays unchanged if squaring would make its parts
 * cross.
 * A second pass can move a ring again, once the first has brought new corners into tolerance.
 *
 * Longitudes are read as plain numbers, so a ring crossing the antimeridian should run past ±180°
 * or be cut into a {@link MultiPolygon}. Each part is squared on its own, so its cut edge can drift
 * off ±180°.
 *
 * Squaring operates in the planar coordinates of an equirectangular projection of a spherical
 * Earth, with a separate projection centered on each ring. For rings up to 1 km across at latitudes
 * up to 89°, the projection adds at most about 0.3° of error to each squared corner's angle. A ring
 * that surrounds a pole is not squared and is returned as it is.
 *
 * @function
 * @param {FeatureCollection<Polygon|MultiPolygon>|Feature<Polygon|MultiPolygon>|Polygon|MultiPolygon} geojson polygons to square up.
 * @param {Object} [options={}] Optional parameters
 * @param {number} [options.toleranceDegrees=15] corners further than this from 90° are not squared, between 0 and 45
 * @param {number} [options.flatToleranceDegrees=5] corners further than this from 180° are not flattened, between 0 and 90
 * @param {number} [options.diagonalToleranceDegrees=8] corners further than this from 45° or 135° are not squared, between 0 and 22.5
 * @returns {FeatureCollection<Polygon|MultiPolygon>|Feature<Polygon|MultiPolygon>|Polygon|MultiPolygon} a squared copy of the input
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
    | FeatureCollection<Polygon | MultiPolygon>
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
  removeBbox(result as GeoJSON);
  geomEach(result, (geometry: Geometry | null) => {
    if (geometry?.type !== "Polygon" && geometry?.type !== "MultiPolygon") {
      if (geometry && geojson.type !== "FeatureCollection") {
        throw new Error(`${geometry.type} geometry is not supported`);
      }
      return;
    }
    if (geometry.type === "Polygon") {
      geometry.coordinates = orthogonalizePolygon(
        geometry.coordinates,
        tolerances
      );
    } else {
      geometry.coordinates = orthogonalizeMultiPolygon(
        geometry.coordinates,
        tolerances
      );
    }
  });
  return result;
}

const METERS_PER_DEGREE = radiansToLength(degreesToRadians(1), "meters");
// How hard each corner pulls toward its angle, from the paper's Table 1, against a pull of 1 for
// every vertex to stay put. The paper's pull of 5 left 4% more OSM buildings in Orthez, Würzburg,
// and Berlin with a corner over 0.5° off, and saved only 6% of the movement
const CORNER_WEIGHTS = { right: 100, flat: 15, acute: 10, obtuse: 10 };
// Squaring settles once no vertex moves more than this share of the mean edge length in a round, or
// gives up after the paper's cap of 50. Long buildings creep toward square, so a tighter stop can
// miss the cap
const CONVERGED_STEP_RATIO = 1e-3;
const MAX_ROUNDS = 50;
// An edge shorter than this share of the mean edge length can flip in one step, so it is merged away
const MERGED_EDGE_RATIO = 0.005;
// A squared edge shorter than this share of its original length has collapsed, so it is rejected.
// A ratio of 0.2 would also reject the diagonal-wall fixture
const COLLAPSED_EDGE_RATIO = 0.1;
// A squared ring with a corner narrower than this has folded, so it is rejected. An angle of 0.01°
// would let the spur and needle fixtures fold
const FOLDED_ANGLE_DEGREES = 0.08;

type CornerKind = keyof typeof CORNER_WEIGHTS;
type Corner = { vertex: number; kind: CornerKind };
type Tolerances = Record<"right" | "flat" | "diagonal", number>;

function orthogonalizeMultiPolygon(
  parts: Position[][][],
  tolerances: Tolerances
) {
  const squaredParts = parts.map((rings) =>
    orthogonalizePolygon(rings, tolerances)
  );
  if (squaredParts.every((rings, i) => rings === parts[i])) return parts;
  // Parts are squared on their own, so neighbors that share a wall can end up crossing
  if (hasCrossingRings(squaredParts.flat())) return parts;
  return squaredParts;
}

function orthogonalizePolygon(rings: Position[][], tolerances: Tolerances) {
  const squaredRings = rings.map((ring) => orthogonalizeRing(ring, tolerances));
  if (squaredRings.every((ring, i) => ring === rings[i])) return rings;
  // Rings are squared on their own, so a hole can end up crossing its outer ring
  if (hasCrossingRings(squaredRings)) return rings;
  // With no crossings a hole is wholly inside or wholly outside, so one vertex decides. A small
  // hole can be moved clear of the wall without crossing it
  for (let i = 1; i < squaredRings.length; i++) {
    if (!isInsideRing(squaredRings[i][0], squaredRings[0])) return rings;
  }
  return squaredRings;
}

/**
 * Squares one ring, or returns it as it is when it can't be squared.
 *
 * @private
 * @param {Position[]} ring a closed ring in degrees
 * @param {Tolerances} tolerances how far a corner may be from each target angle
 * @returns {Position[]} the squared ring, with new positions, or the input ring
 */
function orthogonalizeRing(ring: Position[], tolerances: Tolerances) {
  // Only for its validation, which throws on an unclosed or too short ring
  polygon([ring]);

  // A ring around a pole winds through a full turn of longitude, and no flat projection can hold it
  let windingDegrees = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    const longitudeDelta = ring[i + 1][0] - ring[i][0];
    windingDegrees += longitudeDelta - 360 * Math.round(longitudeDelta / 360);
  }
  if (Math.abs(windingDegrees) > 180) return ring;

  // Project to meters with an equirectangular projection centered on the ring. Corners land off
  // square on the sphere by about tan(latitude) × half the ring's height ÷ Earth's radius, in radians
  const positions = ring.slice(0, -1);
  const meanLatitude =
    positions.reduce((sum, [, latitude]) => sum + latitude, 0) /
    positions.length;
  const metersPerDegreeLongitude =
    METERS_PER_DEGREE * Math.cos(degreesToRadians(meanLatitude));
  const project = ([longitude, latitude]: Position) => [
    longitude * metersPerDegreeLongitude,
    latitude * METERS_PER_DEGREE,
  ];
  const projected = positions.map(project);

  // Drop the closing vertex, repeated vertices, and the start of each very short edge
  const edgeLengths = projected.map(([x, y], i) => {
    const [nextX, nextY] = projected[(i + 1) % projected.length];
    return Math.hypot(nextX - x, nextY - y);
  });
  const shortestEdgeLength =
    (MERGED_EDGE_RATIO * edgeLengths.reduce((sum, length) => sum + length, 0)) /
    positions.length;
  const isKept = (_: unknown, i: number) => edgeLengths[i] > shortestEdgeLength;
  const vertices = positions.filter(isKept);
  if (vertices.length < 3) return ring;
  const original = projected.filter(isKept).flat();

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
  if (corners.length === 0) return ring;

  const squared = squareCorners(original, corners);
  if (
    !squared ||
    hasCrossingEdges(squared) ||
    vertices.some((_, vertex) => {
      const next = (vertex + 1) % vertices.length;
      return (
        Math.abs(squared[2 * vertex + 1]) > 90 * METERS_PER_DEGREE ||
        measureAngle(squared, vertex) < FOLDED_ANGLE_DEGREES ||
        measureDistance(squared, vertex, next) <
          COLLAPSED_EDGE_RATIO * measureDistance(original, vertex, next)
      );
    })
  ) {
    return ring;
  }

  // Unproject by applying each vertex's displacement in degrees to a copy of the position
  for (let i = 0; i < vertices.length; i++) {
    const position = vertices[i].slice();
    position[0] +=
      (squared[2 * i] - original[2 * i]) / metersPerDegreeLongitude;
    position[1] +=
      (squared[2 * i + 1] - original[2 * i + 1]) / METERS_PER_DEGREE;
    vertices[i] = position;
  }
  vertices.push(vertices[0].slice());
  return vertices;
}

/**
 * Iterated least squares adjustment. Each round linearizes the corners and solves for the step
 * that best trades squaring them against moving the vertices.
 *
 * @private
 * @param {number[]} original flat x, y coordinates in meters
 * @param {Corner[]} corners which vertices to square and how
 * @returns {number[]|undefined} squared coordinates, or undefined if the ring never settles
 */
function squareCorners(original: number[], corners: Corner[]) {
  const count = original.length / 2;
  let perimeter = 0;
  for (let i = 0; i < count; i++) {
    perimeter += measureDistance(original, i, (i + 1) % count);
  }
  // A residual is a dot or cross product, in square meters. Dividing by both original edge lengths
  // makes it a cosine or sine, and multiplying by the mean edge length puts it in meters, like vertex
  // movement, which also keeps a short edge from overshooting as it shrinks. The weight squares this
  // scale because the least squares terms square the residual
  const meanEdgeLength = perimeter / count;
  const weightedCorners = corners.map(({ vertex, kind }) => ({
    vertex,
    kind,
    weight:
      CORNER_WEIGHTS[kind] *
      (meanEdgeLength /
        (measureDistance(original, (vertex + count - 1) % count, vertex) *
          measureDistance(original, vertex, (vertex + 1) % count))) **
        2,
  }));
  const current = original.slice();
  for (let round = 0; round < MAX_ROUNDS; round++) {
    // Each corner becomes one equation, linear near the current positions
    const linearized = weightedCorners.map(({ vertex, kind, weight }) => ({
      ...measureResidual(current, vertex, kind),
      weight,
    }));
    // Two competing wishes: every vertex wants to return to where it started, and every corner
    // wants its residual at zero. Minimize |step - (original - current)|² + Σ weight (residual +
    // gradient · step)². That solves (I + Σ w g gᵀ) step = (original − current) − Σ w r g, the paper's
    // Eq. 10
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
    for (let i = 0; i < step.length; i++) current[i] += step[i];
    if (
      step.every(
        (value) => Math.abs(value) < CONVERGED_STEP_RATIO * meanEdgeLength
      )
    ) {
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

function measureDistance(coordinates: number[], a: number, b: number) {
  return Math.hypot(
    coordinates[2 * b] - coordinates[2 * a],
    coordinates[2 * b + 1] - coordinates[2 * a + 1]
  );
}

/**
 * Measures how far a corner is from its target angle, as the dot product of its two edges (the
 * cross product for a flat corner) less the target cosine.
 *
 * @private
 * @param {number[]} coordinates flat x, y coordinates
 * @param {number} vertex index of the corner's vertex
 * @param {CornerKind} kind which angle the corner is pulled toward
 * @returns {Object} residual, zero when the corner is perfect, with its gradient and the indices of
 * the three vertices' coordinates that the gradient is taken with respect to
 */
function measureResidual(
  coordinates: number[],
  vertex: number,
  kind: CornerKind
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
  const targetCosine =
    kind === "acute" ? Math.SQRT1_2 : kind === "obtuse" ? -Math.SQRT1_2 : 0;
  // The cosine barely changes near 180°, so a flat corner rotates one edge by 90° to use the sine.
  // p and q are the derivatives of the product with respect to u and v
  const [px, py, qx, qy] =
    kind === "flat" ? [vy, -vx, -uy, ux] : [vx, vy, ux, uy];
  const dux = px - (targetCosine * vLength * ux) / uLength;
  const duy = py - (targetCosine * vLength * uy) / uLength;
  const dvx = qx - (targetCosine * uLength * vx) / vLength;
  const dvy = qy - (targetCosine * uLength * vy) / vLength;
  return {
    residual: ux * px + uy * py - targetCosine * uLength * vLength,
    indices: [previous, vertex, next].flatMap((index) => [
      2 * index,
      2 * index + 1,
    ]),
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
  for (let a = 0; a < count; a++) {
    const b = (a + 1) % count;
    const ax = coordinates[2 * a];
    const ay = coordinates[2 * a + 1];
    const bx = coordinates[2 * b];
    const by = coordinates[2 * b + 1];
    // Neighboring edges share a vertex, so they can't properly cross
    for (let c = a + 2; c < count; c++) {
      const d = (c + 1) % count;
      const cx = coordinates[2 * c];
      const cy = coordinates[2 * c + 1];
      const dx = coordinates[2 * d];
      const dy = coordinates[2 * d + 1];
      if (segmentsCross(ax, ay, bx, by, cx, cy, dx, dy)) return true;
    }
  }
  return false;
}

function hasCrossingRings(rings: Position[][]) {
  if (rings.length < 2) return false;
  // Rings whose bounding boxes don't overlap can't cross, which skips most pairs of parts in a
  // MultiPolygon with many of them
  const boxes = rings.map((ring) => {
    const box = [Infinity, Infinity, -Infinity, -Infinity];
    for (let i = 0; i < ring.length - 1; i++) {
      if (ring[i][0] < box[0]) box[0] = ring[i][0];
      if (ring[i][1] < box[1]) box[1] = ring[i][1];
      if (ring[i][0] > box[2]) box[2] = ring[i][0];
      if (ring[i][1] > box[3]) box[3] = ring[i][1];
    }
    return box;
  });
  for (let ringA = 0; ringA < rings.length; ringA++) {
    const a = rings[ringA];
    for (let ringB = ringA + 1; ringB < rings.length; ringB++) {
      if (
        boxes[ringA][2] < boxes[ringB][0] ||
        boxes[ringB][2] < boxes[ringA][0] ||
        boxes[ringA][3] < boxes[ringB][1] ||
        boxes[ringB][3] < boxes[ringA][1]
      ) {
        continue;
      }
      const b = rings[ringB];
      for (let i = 0; i < a.length - 1; i++) {
        const ax = a[i][0];
        const ay = a[i][1];
        const bx = a[i + 1][0];
        const by = a[i + 1][1];
        for (let j = 0; j < b.length - 1; j++) {
          const c = b[j];
          const d = b[j + 1];
          if (segmentsCross(ax, ay, bx, by, c[0], c[1], d[0], d[1])) {
            return true;
          }
        }
      }
    }
  }
  return false;
}

// Even-odd ray cast. A point is inside when a ray from it to the right crosses the ring an odd
// number of times. An edge is crossed when it spans the point's latitude and the point lies to the
// left of it, read off the orientation's sign
function isInsideRing(point: Position, ring: Position[]) {
  const x = point[0];
  const y = point[1];
  let isInside = false;
  for (let i = 0; i < ring.length - 1; i++) {
    const x1 = ring[i][0];
    const y1 = ring[i][1];
    const x2 = ring[i + 1][0];
    const y2 = ring[i + 1][1];
    if (
      y1 > y !== y2 > y &&
      measureOrientation(x1, y1, x2, y2, x, y) > 0 === y2 > y1
    ) {
      isInside = !isInside;
    }
  }
  return isInside;
}

// Two segments properly cross when each one's endpoints fall on opposite sides of the other.
// Touching at an endpoint or lying collinear doesn't count
function segmentsCross(
  ax: number,
  ay: number,
  bx: number,
  by: number,
  cx: number,
  cy: number,
  dx: number,
  dy: number
) {
  return (
    measureOrientation(ax, ay, bx, by, cx, cy) *
      measureOrientation(ax, ay, bx, by, dx, dy) <
      0 &&
    measureOrientation(cx, cy, dx, dy, ax, ay) *
      measureOrientation(cx, cy, dx, dy, bx, by) <
      0
  );
}

// The 2D cross product (b - a) × (c - a), known as the orientation test. Its sign says which side of
// the line through a and b the point c is on, and it is zero when all three are collinear
function measureOrientation(
  ax: number,
  ay: number,
  bx: number,
  by: number,
  cx: number,
  cy: number
) {
  return (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
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
