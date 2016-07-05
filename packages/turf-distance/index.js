var getCoord = require('turf-invariant').getCoord;
var radiansToDistance = require('turf-helpers').radiansToDistance;
//http://en.wikipedia.org/wiki/Haversine_formula
//http://www.movable-type.co.uk/scripts/latlong.html

/**
 * Calculates the distance between two {@link Point|points} in degrees, radians,
 * miles, or kilometers. This uses the
 * [Haversine formula](http://en.wikipedia.org/wiki/Haversine_formula)
 * to account for global curvature.
 *
 * @name distance
 * @param {Feature<Point>} from origin point
 * @param {Feature<Point>} to destination point
 * @param {String} [units=kilometers] can be degrees, radians, miles, or kilometers
 * @return {Number} distance between the two points
 * @example
 * var from = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [-75.343, 39.984]
 *   }
 * };
 * var to = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [-75.534, 39.123]
 *   }
 * };
 * var units = "miles";
 *
 * var points = {
 *   "type": "FeatureCollection",
 *   "features": [from, to]
 * };
 *
 * //=points
 *
 * var distance = turf.distance(from, to, units);
 *
 * //=distance
 */
module.exports = function (from, to, units) {
    var degrees2radians = Math.PI / 180;
    var coordinates1 = getCoord(from);
    var coordinates2 = getCoord(to);
    var dLat = degrees2radians * (coordinates2[1] - coordinates1[1]);
    var dLon = degrees2radians * (coordinates2[0] - coordinates1[0]);
    var lat1 = degrees2radians * coordinates1[1];
    var lat2 = degrees2radians * coordinates2[1];

    var a = Math.pow(Math.sin(dLat / 2), 2) +
          Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);

    return radiansToDistance(2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)), units);
};
