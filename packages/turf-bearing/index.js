var getCoord = require('turf-invariant').getCoord;
//http://en.wikipedia.org/wiki/Haversine_formula
//http://www.movable-type.co.uk/scripts/latlong.html

/**
 * Takes two {@link Point|points} and finds the geographic bearing between them.
 *
 * @name bearing
 * @param {Feature<Point>} start starting Point
 * @param {Feature<Point>} end ending Point
 * @returns {Number} bearing in decimal degrees
 * @example
 * var point1 = {
 *   "type": "Feature",
 *   "properties": {
 *     "marker-color": '#f00'
 *   },
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [-75.343, 39.984]
 *   }
 * };
 * var point2 = {
 *   "type": "Feature",
 *   "properties": {
 *     "marker-color": '#0f0'
 *   },
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [-75.534, 39.123]
 *   }
 * };
 *
 * var points = {
 *   "type": "FeatureCollection",
 *   "features": [point1, point2]
 * };
 *
 * //=points
 *
 * var bearing = turf.bearing(point1, point2);
 *
 * //=bearing
 */
module.exports = function (start, end) {
    var degrees2radians = Math.PI / 180;
    var radians2degrees = 180 / Math.PI;
    var coordinates1 = getCoord(start);
    var coordinates2 = getCoord(end);

    var lon1 = degrees2radians * coordinates1[0];
    var lon2 = degrees2radians * coordinates2[0];
    var lat1 = degrees2radians * coordinates1[1];
    var lat2 = degrees2radians * coordinates2[1];
    var a = Math.sin(lon2 - lon1) * Math.cos(lat2);
    var b = Math.cos(lat1) * Math.sin(lat2) -
        Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);

    var bearing = radians2degrees * Math.atan2(a, b);

    return bearing;
};
