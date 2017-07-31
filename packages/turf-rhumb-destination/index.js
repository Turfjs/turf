// https://en.wikipedia.org/wiki/Rhumb_line
// http://www.movable-type.co.uk/scripts/latlong.html#rhumblines
var helpers = require('@turf/helpers');
var getCoord = require('@turf/invariant').getCoord;
var GeodesyLatLon = require('geodesy').LatLonSpherical;
var point = helpers.point;
var radiansToDistance = helpers.radiansToDistance;
var distanceToRadians = helpers.distanceToRadians;

/**
 * Returns the destination {@link Point} having travelled the given distance along a Rhumb line from the
 * origin Point with the (constant) given bearing.
 *
 * @name rhumbDestination
 * @param {Geometry|Feature<Point>|Array<number>} origin starting point
 * @param {number} distance distance from the starting point
 * @param {number} bearing constant bearing angle ranging from -180 to 180 degrees from north
 * @param {string} [units=kilometers] miles, kilometers, degrees, or radians
 * @returns {Feature<Point>} Destination point.
 * @example
 * var point = turf.point([-75.343, 39.984], {"marker-color": "F00"});
 * var distance = 50;
 * var bearing = 90;
 * var units = 'miles';
 *
 * var destination = turf.rhumbDestination(point, distance, bearing, units);
 *
 * //addToMap
 * var addToMap = [point, destination]
 * destination.properties['marker-color'] = '#00F';
 */
module.exports = function (origin, distance, bearing, units) {
    // validation
    if (!origin) throw new Error('origin is required');
    if (distance === undefined || distance === null) throw new Error('distance is required');
    if (bearing === undefined || bearing === null) throw new Error('bearing is required');
    if (!(distance >= 0)) throw new Error('distance must be greater than 0');

    units = units || 'kilometers';
    var distanceInMeters = radiansToDistance(distanceToRadians(distance, units), 'meters');
    var coords = getCoord(origin);
    var pt = new GeodesyLatLon(coords[1], coords[0]);
    var destination = pt.rhumbDestinationPoint(distanceInMeters, bearing);

    // compensate the crossing of the 180th meridian (https://macwright.org/2016/09/26/the-180th-meridian.html)
    // solution from https://github.com/mapbox/mapbox-gl-js/issues/3250#issuecomment-294887678
    destination.lon += (destination.lon - coords[0] > 180) ? -360 : (coords[0] - destination.lon > 180) ? 360 : 0;
    return point([destination.lon, destination.lat]);
};
