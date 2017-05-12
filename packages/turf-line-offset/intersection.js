/**
 * AB
 *
 * @param {Array<Array<number>>} segment - 2 vertex line segment
 * @returns {Array<number>} coordinates [x, y]
 */
function AB(segment) {
    var start = segment.start;
    var end = segment.end;
    return {x: end.x - start.x, y: end.y - start.y};
}

/**
 * Cross Product
 *
 * @param {Array<number>} v1 coordinates [x, y]
 * @param {Array<number>} v2 coordinates [x, y]
 * @returns {Array<number>} Cross Product
 */
function crossProduct(v1, v2) {
    return (v1.x * v2.y) - (v2.x * v1.y);
}

/**
 * Add
 *
 * @param {Array<number>} v1 coordinates [x, y]
 * @param {Array<number>} v2 coordinates [x, y]
 * @returns {Array<number>} Add
 */
function add(v1, v2) {
    return {x: v1.x + v2.x, y: v1.y + v2.y};
}

/**
 * Sub
 *
 * @param {Array<number>} v1 coordinates [x, y]
 * @param {Array<number>} v2 coordinates [x, y]
 * @returns {Array<number>} Sub
 */
function sub(v1, v2) {
    return {x: v1.x - v2.x, y: v1.y - v2.y};
}

/**
 * scalarMult
 *
 * @param {number} s scalar
 * @param {Array<number>} v coordinates [x, y]
 * @returns {Array<number>} scalarMult
 */
function scalarMult(s, v) {
    return {x: s * v.x, y: s * v.y};
}

/**
 * Intersect Segments
 *
 * @param {Array<number>} a coordinates [x, y]
 * @param {Array<number>} b coordinates [x, y]
 * @returns {Array<number>} intersection
 */
function intersectSegments(a, b) {
    var p = a.start;
    var r = AB(a);
    var q = b.start;
    var s = AB(b);

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
 * @param {Array<number>} a coordinates [x, y]
 * @param {Array<number>} b coordinates [x, y]
 * @returns {boolean} true if a and b are parallel (or co-linear)
 */
function isParallel(a, b) {
    var r = AB(a);
    var s = AB(b);
    return (crossProduct(r, s) === 0);
}

/**
 * Interesct
 *
 * @param {Array<number>} a coordinates [x, y]
 * @param {Array<number>} b coordinates [x, y]
 * @returns {Array<number>|false} true if a and b are parallel (or co-linear)
 */
function intersect(a, b) {
    // a = JSON.parse(JSON.stringify(a));
    // b = JSON.parse(JSON.stringify(b));
    // d = [[a.start.x, a.start.y], [a.end.x, a.end.y]];
    // e = [[b.start.x, b.start.y], [b.end.x, b.end.y]];
    if (isParallel(a, b) === false) {
        return intersectSegments(a, b);
    } else {
        return false;
    }
}
module.exports = intersect;
