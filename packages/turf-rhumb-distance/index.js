// https://en.wikipedia.org/wiki/Rhumb_line
// http://www.movable-type.co.uk/scripts/latlong.html#rhumblines
import { radiansToDistance, distanceToRadians } from '@turf/helpers';
import { getCoord } from '@turf/invariant';
import { LatLonSpherical } from 'geodesy';

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
export default function (from, to, units) {
    // validation
    if (!from) throw new Error('from point is required');
    if (!to) throw new Error('to point is required');

    units = units || 'kilometers';

    var coordsFrom = getCoord(from);
    var coordsTo = getCoord(to);
    var origin = new LatLonSpherical(coordsFrom[1], coordsFrom[0]);
    var destination = new LatLonSpherical(coordsTo[1], coordsTo[0]);

    // compensate the crossing of the 180th meridian (https://macwright.org/2016/09/26/the-180th-meridian.html)
    // solution from https://github.com/mapbox/mapbox-gl-js/issues/3250#issuecomment-294887678
    destination[0] += (destination[0] - origin[0] > 180) ? -360 : (origin[0] - destination[0] > 180) ? 360 : 0;
    var distanceInMeters = origin.rhumbDistanceTo(destination);
    var distance = radiansToDistance(distanceToRadians(distanceInMeters, 'meters'), units);
    return distance;
}
