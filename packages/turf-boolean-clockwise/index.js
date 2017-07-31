var invariant = require('@turf/invariant');
var getCoords = invariant.getCoords;

/**
 * Takes a ring and return true or false whether or not the ring is clockwise or counter-clockwise.
 *
 * @name booleanClockwise
 * @param {Geometry|Feature<LineString>|Array<Array<number>>} line to be evaluated
 * @returns {Boolean} true/false
 * @example
 * var clockwiseRing = turf.lineString([[0,0],[1,1],[1,0],[0,0]]);
 * var counterClockwiseRing = turf.lineString([[0,0],[1,0],[1,1],[0,0]]);
 *
 * turf.booleanClockwise(clockwiseRing)
 * //=true
 * turf.booleanClockwise(counterClockwiseRing)
 * //=false
 */
module.exports = function (line) {
    // validation
    if (!line) throw new Error('line is required');
    var type = (line.geometry) ? line.geometry.type : line.type;
    if (!Array.isArray(line) && type !== 'LineString') throw new Error('geometry must be a LineString');

    var ring = getCoords(line);
    var sum = 0;
    var i = 1;
    var prev, cur;
    while (i < ring.length) {
        prev = cur || ring[0];
        cur = ring[i];
        sum += ((cur[0] - prev[0]) * (cur[1] + prev[1]));
        i++;
    }
    return sum > 0;
};
