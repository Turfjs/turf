import { Feature, Polygon } from "geojson";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign#Polyfill
function mathSign(x: number) {
  return ((x > 0) as unknown as number) - ((x < 0) as unknown as number) || +x;
}

/**
 * Returns the direction of the point q relative to the vector p1 -> p2.
 *
 * Implementation of geos::algorithm::CGAlgorithm::orientationIndex()
 * (same as geos::algorithm::CGAlgorithm::computeOrientation())
 *
 * @param {number[]} p1 - the origin point of the vector
 * @param {number[]} p2 - the final point of the vector
 * @param {number[]} q - the point to compute the direction to
 *
 * @returns {number} - 1 if q is ccw (left) from p1->p2,
 *    -1 if q is cw (right) from p1->p2,
 *     0 if q is colinear with p1->p2
 */
export function orientationIndex(p1: number[], p2: number[], q: number[]) {
  const dx1 = p2[0] - p1[0],
    dy1 = p2[1] - p1[1],
    dx2 = q[0] - p2[0],
    dy2 = q[1] - p2[1];

  return mathSign(dx1 * dy2 - dx2 * dy1);
}

/**
 * Checks if two envelopes are equal.
 *
 * The function assumes that the arguments are envelopes, i.e.: Rectangular polygon
 *
 * @param {Feature<Polygon>} env1 - Envelope
 * @param {Feature<Polygon>} env2 - Envelope
 * @returns {boolean} - True if the envelopes are equal
 */
export function envelopeIsEqual(
  env1: Feature<Polygon>,
  env2: Feature<Polygon>
) {
  const envX1 = env1.geometry.coordinates[0].map((c) => c[0]),
    envY1 = env1.geometry.coordinates[0].map((c) => c[1]),
    envX2 = env2.geometry.coordinates[0].map((c) => c[0]),
    envY2 = env2.geometry.coordinates[0].map((c) => c[1]);

  return (
    Math.max.apply(null, envX1) === Math.max.apply(null, envX2) &&
    Math.max.apply(null, envY1) === Math.max.apply(null, envY2) &&
    Math.min.apply(null, envX1) === Math.min.apply(null, envX2) &&
    Math.min.apply(null, envY1) === Math.min.apply(null, envY2)
  );
}

/**
 * Check if a envelope is contained in other one.
 *
 * The function assumes that the arguments are envelopes, i.e.: Convex polygon
 * XXX: Envelopes are rectangular, checking if a point is inside a rectangule is something easy,
 * this could be further improved.
 *
 * @param {Feature<Polygon>} self - Envelope
 * @param {Feature<Polygon>} env - Envelope
 * @returns {boolean} - True if env is contained in self
 */
export function envelopeContains(
  self: Feature<Polygon>,
  env: Feature<Polygon>
) {
  return env.geometry.coordinates[0].every((c) =>
    booleanPointInPolygon(point(c), self)
  );
}

/**
 * Checks if two coordinates are equal.
 *
 * @param {number[]} coord1 - First coordinate
 * @param {number[]} coord2 - Second coordinate
 * @returns {boolean} - True if coordinates are equal
 */
export function coordinatesEqual(coord1: number[], coord2: number[]) {
  return coord1[0] === coord2[0] && coord1[1] === coord2[1];
}
