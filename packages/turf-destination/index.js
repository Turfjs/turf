//http://en.wikipedia.org/wiki/Haversine_formula
//http://www.movable-type.co.uk/scripts/latlong.html
var getCoord = require('turf-invariant').getCoord;
var helpers = require('turf-helpers');
var point = helpers.point;
var distanceToRadians = helpers.distanceToRadians;

/**
 * Takes a {@link Point} and calculates the location of a destination point given a distance in degrees, radians, miles, or kilometers; and bearing in degrees. This uses the [Haversine formula](http://en.wikipedia.org/wiki/Haversine_formula) to account for global curvature.
 *
 * @name destination
 * @param {Feature<Point>} from starting point
 * @param {number} distance distance from the starting point
 * @param {number} bearing ranging from -180 to 180
 * @param {String} [units=kilometers] miles, kilometers, degrees, or radians
 * @returns {Feature<Point>} destination point
 * @example
 * var point = {
 *   "type": "Feature",
 *   "properties": {
 *     "marker-color": "#0f0"
 *   },
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [-75.343, 39.984]
 *   }
 * };
 * var distance = 50;
 * var bearing = 90;
 * var units = 'miles';
 *
 * var destination = turf.destination(point, distance, bearing, units);
 * destination.properties['marker-color'] = '#f00';
 *
 * var result = {
 *   "type": "FeatureCollection",
 *   "features": [point, destination]
 * };
 *
 * //=result
 */
module.exports = function (from, distance, bearing, units) {
    var degrees2radians = Math.PI / 180;
    var radians2degrees = 180 / Math.PI;
    var coordinates1 = getCoord(from);
    var longitude1 = degrees2radians * coordinates1[0];
    var latitude1 = degrees2radians * coordinates1[1];
    var bearing_rad = degrees2radians * bearing;

    var radians = distanceToRadians(distance, units);

    var latitude2 = Math.asin(Math.sin(latitude1) * Math.cos(radians) +
        Math.cos(latitude1) * Math.sin(radians) * Math.cos(bearing_rad));
    var longitude2 = longitude1 + Math.atan2(Math.sin(bearing_rad) *
        Math.sin(radians) * Math.cos(latitude1),
        Math.cos(radians) - Math.sin(latitude1) * Math.sin(latitude2));

    return point([radians2degrees * longitude2, radians2degrees * latitude2]);
};
