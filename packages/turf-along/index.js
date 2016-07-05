var measureDistance = require('turf-distance');
var point = require('turf-helpers').point;
var bearing = require('turf-bearing');
var destination = require('turf-destination');

/**
 * Takes a {@link LineString|line} and returns a {@link Point|point} at a specified distance along the line.
 *
 * @name along
 * @param {Feature<LineString>} line input line
 * @param {number} distance distance along the line
 * @param {String} [units=miles] can be degrees, radians, miles, or kilometers
 * @return {Feature<Point>} Point `distance` `units` along the line
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
 * var along = turf.along(line, 1, 'miles');
 *
 * var result = {
 *   "type": "FeatureCollection",
 *   "features": [line, along]
 * };
 *
 * //=result
 */
module.exports = function (line, distance, units) {
    var coords;
    if (line.type === 'Feature') coords = line.geometry.coordinates;
    else if (line.type === 'LineString') coords = line.coordinates;
    else throw new Error('input must be a LineString Feature or Geometry');

    var travelled = 0;
    for (var i = 0; i < coords.length; i++) {
        if (distance >= travelled && i === coords.length - 1) break;
        else if (travelled >= distance) {
            var overshot = distance - travelled;
            if (!overshot) return point(coords[i]);
            else {
                var direction = bearing(coords[i], coords[i - 1]) - 180;
                var interpolated = destination(coords[i], overshot, direction, units);
                return interpolated;
            }
        } else {
            travelled += measureDistance(coords[i], coords[i + 1], units);
        }
    }
    return point(coords[coords.length - 1]);
};
