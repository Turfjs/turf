// https://en.wikipedia.org/wiki/Rhumb_line
import {getCoord} from '@turf/invariant';
import {radians2degrees, degrees2radians} from '@turf/helpers';

/**
 * Takes two {@link Point|points} and finds the bearing angle between them along a Rhumb line
 * i.e. the angle measured in degrees start the north line (0 degrees)
 *
 * @name rhumbBearing
 * @param {Geometry|Feature<Point>|Array<number>} start starting Point
 * @param {Geometry|Feature<Point>|Array<number>} end ending Point
 * @param {Object} [options] Optional parameters
 * @param {boolean} [options.final=false] calculates the final bearing if true
 * @returns {number} bearing from north in decimal degrees, between -180 and 180 degrees (positive clockwise)
 * @example
 * const point1 = turf.point([-75.343, 39.984], {"marker-color": "#F00"});
 * const point2 = turf.point([-75.534, 39.123], {"marker-color": "#00F"});
 *
 * const bearing = turf.rhumbBearing(point1, point2);
 *
 * //addToMap
 * const addToMap = [point1, point2]
 * point1.properties.bearing = bearing
 * point2.properties.bearing = bearing
 */
export default function (start, end, options) {
    // validation
    if (!start) throw new Error('start point is required');
    if (!end) throw new Error('end point is required');
    const final = (typeof options === 'object') ? options.final : options;

    let bear360;

    if (final) bear360 = rhumbBearing(getCoord(end), getCoord(start));
    else bear360 = rhumbBearing(getCoord(start), getCoord(end));

    const bear180 = (bear360 > 180) ? -(360 - bear360) : bear360;

    return bear180;
}

/**
 * Returns the bearing from ‘this’ point to destination point along a rhumb line.
 * Adapted from Geodesy: https://github.com/chrisveness/geodesy/blob/master/latlon-spherical.js
 *
 * @private
 * @param   {Array<number>} from - origin point.
 * @param   {Array<number>} to - destination point.
 * @returns {number} Bearing in degrees from north.
 * @example
 * const p1 = new LatLon(51.127, 1.338);
 * const p2 = new LatLon(50.964, 1.853);
 * const d = p1.rhumbBearingTo(p2); // 116.7 m
 */
function rhumbBearing(from, to) {
    const φ1 = degrees2radians(from[1]);
    const φ2 = degrees2radians(to[1]);
    let Δλ = degrees2radians((to[0] - from[0]));
    // if dLon over 180° take shorter rhumb line across the anti-meridian:
    if (Δλ > Math.PI) Δλ -= 2 * Math.PI;
    if (Δλ < -Math.PI) Δλ += 2 * Math.PI;

    const Δψ = Math.log(Math.tan(φ2 / 2 + Math.PI / 4) / Math.tan(φ1 / 2 + Math.PI / 4));

    const θ = Math.atan2(Δλ, Δψ);

    return (radians2degrees(θ) + 360) % 360;
}
