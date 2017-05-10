// https://en.wikipedia.org/wiki/Rhumb_line
// http://www.movable-type.co.uk/scripts/latlong.html#rhumblines
var getCoords = require('@turf/invariant').getCoords;
var GeodesyLatLon = require('geodesy').LatLonSpherical;

/**
 * Takes two {@link Point|points} and finds the bearing angle between them along a Rhumb line
 * i.e. the angle measured in degrees start the north line (0 degrees)
 *
 * @name rhumb-bearing
 * @param {Feature<Point>} start starting Point
 * @param {Feature<Point>} end ending Point
 * @param {boolean} [final=false] calculates the final bearing if true
 * @returns {number} bearing from north in decimal degrees, between -180 and 180 degrees (positive clockwise)
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
 *
 * var bearing = turf.rhumbBearing(point1, point2);
 *
 * //addToMap
 * var addToMap = [point1, point2]
 * point1.properties['marker-color'] = '#f00'
 * point2.properties['marker-color'] = '#0f0'
 * point1.properties.bearing = bearing
 */
module.exports = function (start, end, final) {
    // validation
    if (!start) throw new Error('start point is required');
    if (!end) throw new Error('end point is required');

    var coordsStart = getCoords(start);
    var coordsEnd = getCoords(end);
    var origin = new GeodesyLatLon(coordsStart[1], coordsStart[0]);
    var destination = new GeodesyLatLon(coordsEnd[1], coordsEnd[0]);
    var bear360;
    if (final) {
        bear360 = destination.rhumbBearingTo(origin);
    } else {
        bear360 = origin.rhumbBearingTo(destination);
    }

    var bear180 = (bear360 > 180) ? -(360 - bear360) : bear360;

    return bear180;
};
