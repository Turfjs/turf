// https://en.wikipedia.org/wiki/Rhumb_line
// http://www.movable-type.co.uk/scripts/latlong.html#rhumblines
var helpers = require('@turf/helpers');
var getCoords = require('@turf/invariant').getCoords;
var GeodesyLatLon = require('geodesy').LatLonSpherical;
var point = helpers.point;
var radiansToDistance = helpers.radiansToDistance;
var degrees2radians = helpers.degrees2radians;

/**
 * Returns the destination {@link Point} having travelled the given distance along a Rhumb line from the
 * origin Point with the (constant) given bearing.
 *
 * @name rhumbDestination
 * @param {Point|Array<number>} origin starting point
 * @param {number} distance distance from the starting point
 * @param {number} bearing constant bearing angle ranging from -180 to 180 degrees from north
 * @param {string} [units=kilometers] miles, kilometers, degrees, or radians
 * @returns {Point} Destination point.
 * @example
 * var point = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [-75.343, 39.984]
 *   }
 * };
 * var distance = 50;
 * var bearing = 90;// function (from, distance, bearing, units) {
 * var units = 'miles';
 *
 * var destination = turf.rhumbDestination(point, distance, bearing, units);
 *
 * //addToMap
 * destination.properties['marker-color'] = '#f00';
 * point.properties['marker-color'] = '#0f0';
 * var addToMap = [point, destination]
 */
module.exports = function (origin, distance, bearing, units) {
    // validation
    if (!origin) throw new Error('origin is required');
    if (distance === undefined || distance === null || distance < 0) throw new Error('distance is required');
    if (bearing === undefined || bearing === null) throw new Error('bearing is required');

    units = units || 'kilometers';

    var distanceInMeters;
    switch (units) {
    case 'kilometers':
    case 'kilometres':
        distanceInMeters = distance * 1000;
        break;
    case 'miles':
        distanceInMeters = distance * 1609.34;
        break;
    case 'nauticalmiles':
        distanceInMeters = distance * 1852;
        break;
    case 'degrees':
        distanceInMeters = radiansToDistance(degrees2radians(distance), 'meters');
        break;
    case 'radians':
        distanceInMeters = radiansToDistance(distance, 'meters');
        break;
    default:
        throw new Error('units not valid');
    }

    var coords = getCoords(origin);
    var pt = new GeodesyLatLon(coords[1], coords[0]);
    var destination = pt.rhumbDestinationPoint(distanceInMeters, bearing);

    return point([destination.lon, destination.lat]);
};
