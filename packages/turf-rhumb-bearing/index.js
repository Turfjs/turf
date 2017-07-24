// https://en.wikipedia.org/wiki/Rhumb_line
// http://www.movable-type.co.uk/scripts/latlong.html#rhumblines
var getCoord = require('@turf/invariant').getCoord;
var GeodesyLatLon = require('geodesy').LatLonSpherical;

/**
 * Takes two {@link Point|points} and finds the bearing angle between them along a Rhumb line
 * i.e. the angle measured in degrees start the north line (0 degrees)
 *
 * @name rhumbBearing
 * @param {Geometry|Feature<Point>|Array<number>} start starting Point
 * @param {Geometry|Feature<Point>|Array<number>} end ending Point
 * @param {boolean} [final=false] calculates the final bearing if true
 * @returns {number} bearing from north in decimal degrees, between -180 and 180 degrees (positive clockwise)
 * @example
 * var point1 = turf.point([-75.343, 39.984], {"marker-color": "#F00"});
 * var point2 = turf.point([-75.534, 39.123], {"marker-color": "#00F"});
 *
 * var bearing = turf.rhumbBearing(point1, point2);
 *
 * //addToMap
 * var addToMap = [point1, point2]
 * point1.properties.bearing = bearing
 * point2.properties.bearing = bearing
 */
module.exports = function (start, end, final) {
    // validation
    if (!start) throw new Error('start point is required');
    if (!end) throw new Error('end point is required');

    var coordsStart = getCoord(start);
    var coordsEnd = getCoord(end);
    var origin = new GeodesyLatLon(coordsStart[1], coordsStart[0]);
    var destination = new GeodesyLatLon(coordsEnd[1], coordsEnd[0]);
    var bear360;

    if (final) bear360 = destination.rhumbBearingTo(origin);
    else bear360 = origin.rhumbBearingTo(destination);

    var bear180 = (bear360 > 180) ? -(360 - bear360) : bear360;

    return bear180;
};
