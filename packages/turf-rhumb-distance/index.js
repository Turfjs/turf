// https://en.wikipedia.org/wiki/Rhumb_line
// http://www.movable-type.co.uk/scripts/latlong.html#rhumblines
var getCoords = require('@turf/invariant').getCoords;
var distanceToDegrees = require('@turf/helpers').distanceToDegrees;
var distanceToRadians = require('@turf/helpers').distanceToRadians;
var GeodesyLatLon = require('geodesy').LatLonSpherical;

/**
 * Calculates the distance along a rhumb line between two {@link Point|points} in degrees, radians,
 * miles, or kilometers.
 *
 * @name distance
 * @param {Feature<Point>} from origin point
 * @param {Feature<Point>} to destination point
 * @param {string} [units=kilometers] can be degrees, radians, miles, or kilometers
 * @returns {number} distance between the two points
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
 *
 * var distance = turf.rhumbDistance(from, to, "miles");
 *
 * //addToMap
 * from.properties.distance = distance;
 * to.properties.distance = distance;
 * var addToMap = [from, to];
 */
module.exports = function (from, to, units) {
    // validation
    if (!from) throw new Error('from point is required');
    if (!to) throw new Error('to point is required');

    units = units || 'kilometers';

    var coordsFrom = getCoords(from);
    var coordsTo = getCoords(to);
    var origin = new GeodesyLatLon(coordsFrom[1], coordsFrom[0]);
    var destination = new GeodesyLatLon(coordsTo[1], coordsTo[0]);
    var distanceInMeters = origin.rhumbDistanceTo(destination);

    var distance;
    switch (units) {
        case 'kilometers':
        case 'kilometres':
            distance = distanceInMeters / 1000;
            break;
        case 'miles':
            distance = distanceInMeters / 1609.34;
            break;
        case 'nauticalmiles':
            distance = distanceInMeters / 1852;
            break;
        case 'degrees':
            distance = distanceToDegrees(distanceInMeters, 'meters');
            break;
        case 'radians':
            distance = distanceToRadians(distanceInMeters, 'meters');
            break;
        default:
            throw new Error('units not valid');
    }

    return distance;
};
