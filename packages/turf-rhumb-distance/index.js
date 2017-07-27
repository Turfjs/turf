// https://en.wikipedia.org/wiki/Rhumb_line
// http://www.movable-type.co.uk/scripts/latlong.html#rhumblines
var helpers = require('@turf/helpers');
var getCoord = require('@turf/invariant').getCoord;
var GeodesyLatLon = require('geodesy').LatLonSpherical;
var radiansToDistance = helpers.radiansToDistance;
var distanceToRadians = helpers.distanceToRadians;

/**
 * Calculates the distance along a rhumb line between two {@link Point|points} in degrees, radians,
 * miles, or kilometers.
 *
 * @name rhumbDistance
 * @param {Geometry|Feature<Point>|Array<number>} from origin point
 * @param {Geometry|Feature<Point>|Array<number>} to destination point
 * @param {string} [units=kilometers] can be degrees, radians, miles, or kilometers
 * @returns {number} distance between the two points
 * @example
 * var from = turf.point([-75.343, 39.984]);
 * var to = turf.point([-75.534, 39.123]);
 *
 * var distance = turf.rhumbDistance(from, to, "miles");
 *
 * //addToMap
 * var addToMap = [from, to];
 * from.properties.distance = distance;
 * to.properties.distance = distance;
 */
module.exports = function (from, to, units) {
    // validation
    if (!from) throw new Error('from point is required');
    if (!to) throw new Error('to point is required');

    units = units || 'kilometers';

    var coordsFrom = getCoord(from);
    var coordsTo = getCoord(to);
    var origin = new GeodesyLatLon(coordsFrom[1], coordsFrom[0]);
    var destination = new GeodesyLatLon(coordsTo[1], coordsTo[0]);

    // compensate the crossing of the 180th meridian (https://macwright.org/2016/09/26/the-180th-meridian.html)
    // solution from https://github.com/mapbox/mapbox-gl-js/issues/3250#issuecomment-294887678
    destination[0] += (destination[0] - origin[0] > 180) ? -360 : (origin[0] - destination[0] > 180) ? 360 : 0;
    var distanceInMeters = origin.rhumbDistanceTo(destination);
    var distance = radiansToDistance(distanceToRadians(distanceInMeters, 'meters'), units);
    return distance;
};
