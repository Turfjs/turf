import type {
  Feature,
  FeatureCollection,
  Geometry,
  MultiPolygon,
  Polygon,
  Position,
} from "geojson";
import { clone } from "@turf/clone";
import { AllGeoJSON, degreesToRadians } from "@turf/helpers";
import { geomEach } from "@turf/meta";
import { toMercator, toWgs84 } from "@turf/projection";

/**
 * Squares up a {@link Polygon} or {@link MultiPolygon}, nudging its vertices so that corners near
 * 90° move close to right angles, corners within 8° of 45° or 135° move close to those angles, and
 * corners within 5° of straight move close to straight. Most finish within 0.5°, but many are not exact.
 * This is a common cleanup step for building footprints traced from imagery. It makes shapes look
 * regular but doesn't guarantee they are closer to the real building.
 *
 * Balances squaring every matching corner against moving the vertices, based on Lokhat and Touya,
 * "Enhancing building footprints with squaring operations" (JOSIS, 2016). Other corners are not
 * squared, though moving their neighbors can change their angle.
 *
 * Each ring is squared independently, so holes and adjacent polygons that share a wall can drift
 * apart. A ring stays unchanged if squaring would fold it, cross its edges, or fail to settle, or if
 * it is beyond the Mercator latitude limit of 85.05°.
 *
 * @function
 * @param {FeatureCollection|Feature<Polygon|MultiPolygon>|Polygon|MultiPolygon} geojson polygons to square up. Other geometries in a FeatureCollection are copied as they are
 * @param {Object} [options={}] Optional parameters
 * @param {number} [options.thresholdDegrees=15] corners further than this from square are not squared, between 0 and 45
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
>(geojson: T, options: { thresholdDegrees?: number } = {}): T {
  const thresholdDegrees = options.thresholdDegrees ?? 15;
  if (!(thresholdDegrees >= 0 && thresholdDegrees <= 45)) {
    throw new Error("thresholdDegrees must be between 0 and 45");
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
      orthogonalizeRing(ring, degreesToRadians(thresholdDegrees));
    }
  });
  return result;
}

// toMercator clamps latitudes beyond this, which would flatten the shape.
const MAX_MERCATOR_LATITUDE = 85.0511287798066;
// Curves have many corners just short of straight, so straightening is held to a tighter limit.
const STRAIGHT_THRESHOLD_RADIANS = degreesToRadians(5);
const DIAGONAL_THRESHOLD_RADIANS = degreesToRadians(8);
// Per squared mean edge length in meters, so the result doesn't depend on the ring's size. Higher
// weights make corners more exact but let impossible corner sets distort the ring.
const CORNER_WEIGHTS = { square: 100, straight: 15, acute: 10, obtuse: 10 };
const CONVERGED_STEP_METERS = 1e-3;
const FOLDED_COSINE = 1 - 1e-6;

type CornerKind = "square" | "straight" | "acute" | "obtuse";

function orthogonalizeRing(ring: Position[], thresholdRadians: number) {
  // Dropping a vertex equal to the next one removes repeats and the closing vertex alike.
  const vertices = ring.filter((position, i) => {
    const next = ring[(i + 1) % ring.length];
    return position[0] !== next[0] || position[1] !== next[1];
  });
  if (
    vertices.length < 3 ||
    vertices.some(([, latitude]) => Math.abs(latitude) > MAX_MERCATOR_LATITUDE)
  ) {
    return;
  }
  const original = vertices.flatMap((position) => toMercator(position));

  const corners: { vertex: number; kind: CornerKind }[] = [];
  for (let vertex = 0; vertex < vertices.length; vertex++) {
    const { residual: cosine } = measureCorner(original, vertex, "square");
    if (Math.abs(cosine) < Math.sin(thresholdRadians)) {
      corners.push({ vertex, kind: "square" });
    } else if (cosine < -Math.cos(STRAIGHT_THRESHOLD_RADIANS)) {
      corners.push({ vertex, kind: "straight" });
    } else if (
      Math.abs(Math.acos(Math.abs(cosine)) - Math.PI / 4) <
      DIAGONAL_THRESHOLD_RADIANS
    ) {
      corners.push({ vertex, kind: cosine > 0 ? "acute" : "obtuse" });
    }
  }

  const perimeter = vertices.reduce((sum, _, i) => {
    const next = (i + 1) % vertices.length;
    return (
      sum +
      Math.hypot(
        original[2 * next] - original[2 * i],
        original[2 * next + 1] - original[2 * i + 1]
      )
    );
  }, 0);
  const weightScale = (perimeter / vertices.length) ** 2;
  const current = original.slice();
  let hasSettled = false;

  // Gauss-Newton. Each round linearizes the corners and solves for the best step.
  for (let round = 0; round < 50; round++) {
    const linearized = corners.map(({ vertex, kind }) => ({
      ...measureCorner(current, vertex, kind, original),
      weight: CORNER_WEIGHTS[kind] * weightScale,
    }));
    // Minimize |step - (original - current)|² + Σ weight (residual + gradient · step)².
    const target = original.map((value, i) => value - current[i]);
    for (const { residual, indices, gradient, weight } of linearized) {
      indices.forEach((index, k) => {
        target[index] -= weight * residual * gradient[k];
      });
    }
    const step = conjugateGradient((vector) => {
      const product = vector.slice();
      for (const { indices, gradient, weight } of linearized) {
        const dot = indices.reduce(
          (sum, index, k) => sum + gradient[k] * vector[index],
          0
        );
        indices.forEach((index, k) => {
          product[index] += weight * dot * gradient[k];
        });
      }
      return product;
    }, target);
    step.forEach((value, i) => (current[i] += value));
    if (step.every((value) => Math.abs(value) < CONVERGED_STEP_METERS)) {
      hasSettled = true;
      break;
    }
  }

  // A corner squeezed shut folds its two edges flat onto each other, which never counts as crossing.
  const isFolded =
    hasCrossingEdges(current) ||
    vertices.some(
      (_, vertex) =>
        !(measureCorner(current, vertex, "square").residual < FOLDED_COSINE)
    );
  if (isFolded || !hasSettled) return;

  // Vertices that barely moved keep their exact coordinates, free of projection rounding.
  vertices.forEach((position, i) => {
    if (
      Math.hypot(
        current[2 * i] - original[2 * i],
        current[2 * i + 1] - original[2 * i + 1]
      ) >= CONVERGED_STEP_METERS
    ) {
      [position[0], position[1]] = toWgs84([
        current[2 * i],
        current[2 * i + 1],
      ]);
    }
  });
  ring.splice(0, ring.length, ...vertices, vertices[0].slice());
}

// Each corner's residual is zero when the corner is perfect. That's the cosine for a square corner,
// the sine for a straight one, and the cosine's distance from ±√½ for an acute or obtuse one.
// Returns the residual and its gradient with respect to the three vertices' coordinates.
// Residuals divide by the lengths in `reference`. Dividing by the current lengths makes short edges
// overshoot, so Gauss-Newton can wander far from the input or never settle.
function measureCorner(
  coordinates: number[],
  vertex: number,
  kind: CornerKind,
  reference = coordinates
) {
  const count = coordinates.length / 2;
  const [a, b, c] = [
    (vertex + count - 1) % count,
    vertex,
    (vertex + 1) % count,
  ];
  const u = [
    coordinates[2 * a] - coordinates[2 * b],
    coordinates[2 * a + 1] - coordinates[2 * b + 1],
  ];
  const v = [
    coordinates[2 * c] - coordinates[2 * b],
    coordinates[2 * c + 1] - coordinates[2 * b + 1],
  ];
  const uLength = Math.hypot(u[0], u[1]);
  const vLength = Math.hypot(v[0], v[1]);
  const referenceLengths =
    Math.hypot(
      reference[2 * a] - reference[2 * b],
      reference[2 * a + 1] - reference[2 * b + 1]
    ) *
    Math.hypot(
      reference[2 * c] - reference[2 * b],
      reference[2 * c + 1] - reference[2 * b + 1]
    );
  const targetCosine =
    kind === "acute" ? Math.SQRT1_2 : kind === "obtuse" ? -Math.SQRT1_2 : 0;
  // Rotating one side by 90° turns the cosine into the sine.
  const [p, q] =
    kind === "straight"
      ? [
          [v[1], -v[0]],
          [-u[1], u[0]],
        ]
      : [v, u];
  const du = [0, 1].map(
    (k) => (p[k] - (targetCosine * vLength * u[k]) / uLength) / referenceLengths
  );
  const dv = [0, 1].map(
    (k) => (q[k] - (targetCosine * uLength * v[k]) / vLength) / referenceLengths
  );
  return {
    residual:
      (u[0] * p[0] + u[1] * p[1] - targetCosine * uLength * vLength) /
      referenceLengths,
    indices: [2 * a, 2 * a + 1, 2 * b, 2 * b + 1, 2 * c, 2 * c + 1],
    gradient: [du[0], du[1], -du[0] - dv[0], -du[1] - dv[1], dv[0], dv[1]],
  };
}

// Corners that can't all be square, like those on a narrow comb, can push edges across each other.
function hasCrossingEdges(coordinates: number[]) {
  const count = coordinates.length / 2;
  // The sign says which side of the line through a and b the point c is on.
  const getSide = (a: number, b: number, c: number) =>
    (coordinates[2 * b] - coordinates[2 * a]) *
      (coordinates[2 * c + 1] - coordinates[2 * a + 1]) -
    (coordinates[2 * b + 1] - coordinates[2 * a + 1]) *
      (coordinates[2 * c] - coordinates[2 * a]);
  for (let a = 0; a < count; a++) {
    const b = (a + 1) % count;
    // Neighboring edges share a vertex, so they can't properly cross.
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

// Solves multiply(x) = target for a symmetric positive definite operator.
function conjugateGradient(
  multiply: (vector: number[]) => number[],
  target: number[]
) {
  const dot = (a: number[], b: number[]) =>
    a.reduce((sum, value, i) => sum + value * b[i], 0);
  const solution = target.map(() => 0);
  const residual = target.slice();
  const direction = target.slice();
  let residualSquared = dot(residual, residual);
  for (let i = 0; i < target.length && residualSquared > 1e-14; i++) {
    const product = multiply(direction);
    const stepSize = residualSquared / dot(direction, product);
    direction.forEach((value, j) => {
      solution[j] += stepSize * value;
      residual[j] -= stepSize * product[j];
    });
    const nextResidualSquared = dot(residual, residual);
    direction.forEach((value, j) => {
      direction[j] =
        residual[j] + (nextResidualSquared / residualSquared) * value;
    });
    residualSquared = nextResidualSquared;
  }
  return solution;
}

export { orthogonalize };
export default orthogonalize;
