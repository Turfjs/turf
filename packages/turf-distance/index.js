var getCoord = require('turf-invariant').getCoord;
//http://en.wikipedia.org/wiki/Haversine_formula
//http://www.movable-type.co.uk/scripts/latlong.html

/**
 * Calculates the distance between two {@link Point|points} in degrees, radians,
 * miles, or kilometers. This uses the
 * [Haversine formula](http://en.wikipedia.org/wiki/Haversine_formula)
 * to account for global curvature.
 *
 * @module turf/distance
 * @category measurement
 * @param {Feature<Point>} from origin point
 * @param {Feature<Point>} to destination point
 * @param {String} [units=kilometers] can be degrees, radians, miles, or kilometers
 * @return {Number} distance between the two points
 * @example
 * var point1 = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [-75.343, 39.984]
 *   }
 * };
 * var point2 = {
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
 *   "features": [point1, point2]
 * };
 *
 * //=points
 *
 * var distance = turf.distance(point1, point2, units);
 *
 * //=distance
 */
module.exports = function (point1, point2, units) {
    var coordinates1 = getCoord(point1);
    var coordinates2 = getCoord(point2);
    var dLat = toRad(coordinates2[1] - coordinates1[1]);
    var dLon = toRad(coordinates2[0] - coordinates1[0]);
    var lat1 = toRad(coordinates1[1]);
    var lat2 = toRad(coordinates2[1]);

    var a = Math.pow(Math.sin(dLat / 2), 2) +
          Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    switch (units) {
    case 'miles':
        return c * 3960;
    case 'kilometers':
    case 'kilometres':
        return c * 6373;
    case 'degrees':
        return c * 57.2957795;
    case 'radians':
        return c;
    case 'inches':
        return c * 250905600;
    case 'yards':
        return c * 6969600
    case 'meters':
    case 'metres':
        return c * 637300;
    case undefined:
        return c * 6373;
    default:
        throw new Error('unknown option given to "units"');
    }
};

function toRad(degree) {
    return degree * Math.PI / 180;
}
