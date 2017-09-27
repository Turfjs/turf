// https://en.wikipedia.org/wiki/Rhumb_line
import {convertDistance} from '@turf/helpers';
import {getCoord} from '@turf/invariant';

/**
 * Calculates the distance along a rhumb line between two {@link Point|points} in degrees, radians,
 * miles, or kilometers.
 *
 * @name rhumbDistance
 * @param {Geometry|Feature<Point>|Array<number>} from origin point
 * @param {Geometry|Feature<Point>|Array<number>} to destination point
 * @param {Object} [options] Optional parameters
 * @param {string} [options.units="kilometers"] can be degrees, radians, miles, or kilometers
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
export default function (from, to, options) {
    // validation
    if (!from) throw new Error('from point is required');
    if (!to) throw new Error('to point is required');
    const units = (typeof options === 'object') ? options.units : options || 'kilometers';

    const origin = getCoord(from);
    const destination = getCoord(to);

    // compensate the crossing of the 180th meridian (https://macwright.org/2016/09/26/the-180th-meridian.html)
    // solution from https://github.com/mapbox/mapbox-gl-js/issues/3250#issuecomment-294887678
    destination[0] += (destination[0] - origin[0] > 180) ? -360 : (origin[0] - destination[0] > 180) ? 360 : 0;
    const distanceInMeters = rhumbDistance(origin, destination);
    const distance = convertDistance(distanceInMeters, 'meters', units);
    return distance;
}

/**
 * Returns the distance travelling from ‘this’ point to destination point along a rhumb line.
 * Adapted from Geodesy: https://github.com/chrisveness/geodesy/blob/master/latlon-spherical.js
 *
 * @private
 * @param   {Array<number>} origin point.
 * @param   {Array<number>} destination point.
 * @param   {number} [radius=6371e3] - (Mean) radius of earth (defaults to radius in metres).
 * @returns {number} Distance in km between this point and destination point (same units as radius).
 *
 * @example
 *     var p1 = new LatLon(51.127, 1.338);
 *     var p2 = new LatLon(50.964, 1.853);
 *     var d = p1.distanceTo(p2); // 40.31 km
 */
function rhumbDistance(origin, destination, radius) {
    radius = (radius === undefined) ? 6371e3 : Number(radius);

    // see www.edwilliams.org/avform.htm#Rhumb

    const R = radius;
    const φ1 = origin[1] * Math.PI / 180;
    const φ2 = destination[1] * Math.PI / 180;
    const Δφ = φ2 - φ1;
    let Δλ = Math.abs(destination[0] - origin[0]) * Math.PI / 180;
    // if dLon over 180° take shorter rhumb line across the anti-meridian:
    if (Δλ > Math.PI) Δλ -= 2 * Math.PI;

    // on Mercator projection, longitude distances shrink by latitude; q is the 'stretch factor'
    // q becomes ill-conditioned along E-W line (0/0); use empirical tolerance to avoid it
    const Δψ = Math.log(Math.tan(φ2 / 2 + Math.PI / 4) / Math.tan(φ1 / 2 + Math.PI / 4));
    const q = Math.abs(Δψ) > 10e-12 ? Δφ / Δψ : Math.cos(φ1);

    // distance is pythagoras on 'stretched' Mercator projection
    const δ = Math.sqrt(Δφ * Δφ + q * q * Δλ * Δλ); // angular distance in radians
    const dist = δ * R;

    return dist;
}
