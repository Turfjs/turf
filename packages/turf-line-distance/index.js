var distance = require('turf-distance');
var point = require('turf-helpers').point;
/**
 * Takes a {@link LineString|line} and measures its length in the specified units.
 *
 * @module turf/line-distance
 * @category measurement
 * @param {Feature<LineString>} line line to measure
 * @param {String} units can be degrees, radians, miles, or kilometers
 * @return {Number} length of the input line
 * @example
 * var line = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "LineString",
 *     "coordinates": [
 *       [-77.031669, 38.878605],
 *       [-77.029609, 38.881946],
 *       [-77.020339, 38.884084],
 *       [-77.025661, 38.885821],
 *       [-77.021884, 38.889563],
 *       [-77.019824, 38.892368]
 *     ]
 *   }
 * };
 *
 * var length = turf.lineDistance(line, 'miles');
 *
 * //=line
 *
 * //=length
 */

module.exports = function (line, units) {
    var coords;
    if (line.type === 'Feature') coords = line.geometry.coordinates;
    else if (line.type === 'LineString') coords = line.coordinates;
    else throw new Error('input must be a LineString Feature or Geometry');

    var travelled = 0;
    var prevCoords = point(coords[0]);
    var curCoords = point(coords[0]);
    var temp;
    for (var i = 1; i < coords.length; i++) {
        curCoords.geometry.coordinates = coords[i];
        travelled += distance(prevCoords, curCoords, units);
        temp = prevCoords;
        prevCoords = curCoords;
        curCoords = temp;
    }
    return travelled;
};
