var invariant = require('@turf/invariant');
var getCoords = invariant.getCoords;
var getGeomType = invariant.getGeomType;

/**
 * Takes a ring and return true or false whether or not the ring is clockwise or counter-clockwise.
 *
 * @name clockwise
 * @param {LineString|Polygon} feature GeoJSON Feature or Geometry
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
    var type = getGeomType(feature);
    if (type !== 'LineString' && type !== 'Polygon') throw new Error('feature geometry not supported');

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
