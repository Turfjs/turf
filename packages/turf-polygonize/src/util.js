const inside = require('@turf/inside'),
  { point } = require('@turf/helpers');

/** Returns the direction of the point q relative to the vector p1 -> p2.
 * Implementation of geos::algorithm::CGAlgorithm::orientationIndex()
 * (same as geos::algorithm::CGAlgorithm::computeOrientation())
 *
 * @param {Number[]} p1 - the origin point of the vector
 * @param {Number[]} p2 - the final point of the vector
 * @param {Number[]} q - the point to compute the direction to
 *
 * @return 1 if q is ccw (left) from p1->p2,
 *        -1 if q is cw (right) from p1->p2,
 *         0 if q is colinear with p1->p2
 */
function orientationIndex(p1, p2, q) {
  const dx1 = p2[0] - p1[0],
    dy1 = p2[1] - p1[1],
    dx2 = q[0] - p2[0],
    dy2 = q[1] - p2[1];

  return Math.sign(dx1 * dy2 - dx2 * dy1);
}

/** Checks if two envelopes are equal.
 * The function assumes that the arguments are envelopes, i.e.: Rectangular polygon
 *
 * @param {Feature<Polygon>} env1 - Envelope
 * @param {Feature<Polygon>} env2 - Envelope
 * @return {Boolean} - True if the envelopes are equal
 */
function envelopeIsEqual(env1, env2) {
  const envX1 = env1.geometry.coordinates.map(c => c[0]),
    envY1 = env1.geometry.coordinates.map(c => c[1]),
    envX2 = env2.geometry.coordinates.map(c => c[0]),
    envY2 = env2.geometry.coordinates.map(c => c[1]);

  return Math.max(null, envX1) == Math.max(null, envX2) &&
    Math.max(null, envY1) == Math.max(null, envY2) &&
    Math.min(null, envX1) == Math.min(null, envX2) &&
    Math.min(null, envY1) == Math.min(null, envY2);
}

/** Check if a envelope is contained in other one.
 * The function assumes that the arguments are envelopes, i.e.: Convex polygon
 * XXX: Envelopes are rectangular, checking if a point is inside a rectangule is something easy,
 * this could be further improved.
 *
 * @param {Feature<Polygon>} self - Envelope
 * @param {Feature<Polygon>} env - Envelope
 * @return {Boolean} - True if env is contained in self
 */
function envelopeContains(self, env) {
  return env.geometry.coordinates[0].every(c => inside(point(c), self));
}

/** Checks if two coordinates are equal.
 *
 * @param {Number[]}
 * @param {Number[]}
 * @return {Boolean} - True if coordinates are equal
 */
function coordinatesEqual(coord1, coord2) {
  return coord1[0] == coord2[0] && coord1[1] == coord2[1];
}

module.exports = {
  orientationIndex,
  envelopeIsEqual,
  envelopeContains,
  coordinatesEqual,
};
