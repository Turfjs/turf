var invariant = require('@turf/invariant');
var getCoords = invariant.getCoords;

/**
 * Takes a ring and return true or false whether or not the ring is clockwise or counter-clockwise.
 *
 * @name clockwise
 * @param {Geometry|Feature<LineString>|Array<Array<number>>} feature to be evaluated
 * @returns {Boolean} true/false
 * @example
 * var clockwiseRing = [[0,0],[1,1],[1,0],[0,0]]
 * var counterClockwiseRing = [[0,0],[1,0],[1,1],[0,0]]
 *
 * turf.isClockwise(clockwiseRing)
 * //=true
 * turf.isClockwise(counterClockwiseRing)
 * //=false
 */
module.exports = function (feature) {
    // validation
    if (!feature) throw new Error('feature is required');
    if (!Array.isArray(feature) && feature.geometry.type !== 'LineString' && feature.type !== 'LineString')
        throw new Error('feature geometry not supported');

    var ring = getCoords(feature);
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
