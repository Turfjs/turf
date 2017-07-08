/**
 * https://github.com/rook2pawn/node-intersection
 *
 * Author @rook2pawn
 */

/**
 * AB
 *
 * @private
 * @param {Array<Array<number>>} segment - 2 vertex line segment
 * @returns {Array<number>} coordinates [x, y]
 */
function ab(segment) {
    var start = segment[0];
    var end = segment[1];
    return [end[0] - start[0], end[1] - start[1]];
}

/**
 * Cross Product
 *
 * @private
 * @param {Array<number>} v1 coordinates [x, y]
 * @param {Array<number>} v2 coordinates [x, y]
 * @returns {Array<number>} Cross Product
 */
function crossProduct(v1, v2) {
    return (v1[0] * v2[1]) - (v2[0] * v1[1]);
}

/**
 * Add
 *
 * @private
 * @param {Array<number>} v1 coordinates [x, y]
 * @param {Array<number>} v2 coordinates [x, y]
 * @returns {Array<number>} Add
 */
function add(v1, v2) {
    return [v1[0] + v2[0], v1[1] + v2[1]];
}

/**
 * Sub
 *
 * @private
 * @param {Array<number>} v1 coordinates [x, y]
 * @param {Array<number>} v2 coordinates [x, y]
 * @returns {Array<number>} Sub
 */
function sub(v1, v2) {
    return [v1[0] - v2[0], v1[1] - v2[1]];
}

/**
 * scalarMult
 *
 * @private
 * @param {number} s scalar
 * @param {Array<number>} v coordinates [x, y]
 * @returns {Array<number>} scalarMult
 */
function scalarMult(s, v) {
    return [s * v[0], s * v[1]];
}

/**
 * Intersect Segments
 *
 * @private
 * @param {Array<number>} a coordinates [x, y]
 * @param {Array<number>} b coordinates [x, y]
 * @returns {Array<number>} intersection
 */
function intersectSegments(a, b) {
    var p = a[0];
    var r = ab(a);
    var q = b[0];
    var s = ab(b);

    var cross = crossProduct(r, s);
    var qmp = sub(q, p);
    var numerator = crossProduct(qmp, s);
    var t = numerator / cross;
    var intersection = add(p, scalarMult(t, r));
    return intersection;
}

/**
 * Is Parallel
 *
 * @private
 * @param {Array<number>} a coordinates [x, y]
 * @param {Array<number>} b coordinates [x, y]
 * @returns {boolean} true if a and b are parallel (or co-linear)
 */
function isParallel(a, b) {
    var r = ab(a);
    var s = ab(b);
    return (crossProduct(r, s) === 0);
}

/**
 * Intersection
 *
 * @private
 * @param {Array<number>} a coordinates [x, y]
 * @param {Array<number>} b coordinates [x, y]
 * @returns {Array<number>|boolean} true if a and b are parallel (or co-linear)
 */
function intersection(a, b) {
    if (isParallel(a, b)) return false;
    return intersectSegments(a, b);
}

module.exports = intersection;
