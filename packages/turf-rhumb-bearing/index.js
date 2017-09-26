// https://en.wikipedia.org/wiki/Rhumb_line
import {getCoord} from '@turf/inconstiant';
import {radians2degrees, degrees2radians} from '@turf/helpers';

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
export default function (start, end, final) {
    // validation
    if (!start) throw new Error('start point is required');
    if (!end) throw new Error('end point is required');

    const coordsStart = getCoord(start);
    const coordsEnd = getCoord(end);
    const origin = new LatLon(coordsStart[1], coordsStart[0]);
    const destination = new LatLon(coordsEnd[1], coordsEnd[0]);
    let bear360;

    if (final) bear360 = destination.rhumbBearingTo(origin);
    else bear360 = origin.rhumbBearingTo(destination);

    const bear180 = (bear360 > 180) ? -(360 - bear360) : bear360;

    return bear180;
}


// The following functions have been taken from Geodesy
// (https://github.com/chrisveness/geodesy/blob/master/latlon-spherical.js)
// in order to remove it as dpendency and reduce the final bundle size

/**
 * Creates a LatLon point on the earth's surface at the specified latitude / longitude.
 *
 * @private
 * @constructor
 * @param {number} lat - Latitude in degrees.
 * @param {number} lon - Longitude in degrees.
 * @example
 * const p1 = new LatLon(52.205, 0.119);
 */
function LatLon(lat, lon) {
    // allow instantiation without 'new'
    if (!(this instanceof LatLon)) return new LatLon(lat, lon);

    this.lat = Number(lat);
    this.lon = Number(lon);
}

/**
 * Returns the bearing from ‘this’ point to destination point along a rhumb line.
 *
 * @private
 * @param   {LatLon} point - Latitude/longitude of destination point.
 * @returns {number} Bearing in degrees from north.
 * @example
 * const p1 = new LatLon(51.127, 1.338);
 * const p2 = new LatLon(50.964, 1.853);
 * const d = p1.rhumbBearingTo(p2); // 116.7 m
 */
LatLon.prototype.rhumbBearingTo = function (point) {
    if (!(point instanceof LatLon)) throw new TypeError('point is not LatLon object');

    const φ1 = degrees2radians(this.lat);
    const φ2 = degrees2radians(point.lat);
    let Δλ = degrees2radians((point.lon - this.lon));
    // if dLon over 180° take shorter rhumb line across the anti-meridian:
    if (Δλ > Math.PI) Δλ -= 2 * Math.PI;
    if (Δλ < -Math.PI) Δλ += 2 * Math.PI;

    const Δψ = Math.log(Math.tan(φ2 / 2 + Math.PI / 4) / Math.tan(φ1 / 2 + Math.PI / 4));

    const θ = Math.atan2(Δλ, Δψ);

    return (radians2degrees(θ) + 360) % 360;
};
