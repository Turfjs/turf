// https://en.wikipedia.org/wiki/Rhumb_line
import { point, convertDistance, degrees2radians } from '@turf/helpers';
import { getCoord } from '@turf/invariant';

/**
 * Returns the destination {@link Point} having travelled the given distance along a Rhumb line from the
 * origin Point with the (constant) given bearing.
 *
 * @name rhumbDestination
 * @param {Geometry|Feature<Point>|Array<number>} origin starting point
 * @param {number} distance distance from the starting point
 * @param {number} bearing constant bearing angle ranging from -180 to 180 degrees from north
 * @param {Object} [options] Optional parameters
 * @param {string} [options.units="kilometers"] can be degrees, radians, miles, or kilometers
 * @returns {Feature<Point>} Destination point.
 * @example
 * var pt = turf.point([-75.343, 39.984], {"marker-color": "F00"});
 * var distance = 50;
 * var bearing = 90;
 *
 * var destination = rhumbDestination(pt, distance, bearing, {units: 'miles'});
 *
 * //addToMap
 * var addToMap = [pt, destination]
 * destination.properties['marker-color'] = '#00F';
 */
export default function rhumbDestination(origin, distance, bearing, options) {
    // validation
    if (!origin) throw new Error('origin is required');
    if (distance === undefined || distance === null) throw new Error('distance is required');
    if (bearing === undefined || bearing === null) throw new Error('bearing is required');
    if (!(distance >= 0)) throw new Error('distance must be greater than 0');
    const units = (typeof options === 'object') ? options.units : options || 'kilometers';

    const distanceInMeters = convertDistance(distance, units, 'meters');
    const coords = getCoord(origin);
    const destination = rhumbDestinationPoint(coords, distanceInMeters, bearing);

    // compensate the crossing of the 180th meridian (https://macwright.org/2016/09/26/the-180th-meridian.html)
    // solution from https://github.com/mapbox/mapbox-gl-js/issues/3250#issuecomment-294887678
    destination[0] += (destination[0] - coords[0] > 180) ? -360 : (coords[0] - destination[0] > 180) ? 360 : 0;
    return point(destination);
}

/**
 * Returns the destination point having travelled along a rhumb line from origin point the given
 * distance on the  given bearing.
 * Adapted from Geodesy: http://www.movable-type.co.uk/scripts/latlong.html#rhumblines
 *
 * @private
 * @param   {Array<number>} origin - point
 * @param   {number} distance - Distance travelled, in same units as earth radius (default: metres).
 * @param   {number} bearing - Bearing in degrees from north.
 * @param   {number} [radius=6371e3] - (Mean) radius of earth (defaults to radius in metres).
 * @returns {Array<number>} Destination point.
 */
function rhumbDestinationPoint(origin, distance, bearing, radius) {
    radius = (radius === undefined) ? 6371e3 : Number(radius);

    const δ = distance / radius; // angular distance in radians
    const λ1 = origin[0] * Math.PI / 180; // to radians, but without normalize to 𝜋
    const φ1 = degrees2radians(origin[1]);
    const θ = degrees2radians(bearing);

    const Δφ = δ * Math.cos(θ);
    let φ2 = φ1 + Δφ;

    // check for some daft bugger going past the pole, normalise latitude if so
    if (Math.abs(φ2) > Math.PI / 2) φ2 = φ2 > 0 ? Math.PI - φ2 : -Math.PI - φ2;

    const Δψ = Math.log(Math.tan(φ2 / 2 + Math.PI / 4) / Math.tan(φ1 / 2 + Math.PI / 4));
    const q = Math.abs(Δψ) > 10e-12 ? Δφ / Δψ : Math.cos(φ1); // E-W course becomes ill-conditioned with 0/0

    const Δλ = δ * Math.sin(θ) / q;
    const λ2 = λ1 + Δλ;

    return [((λ2 * 180 / Math.PI) + 540) % 360 - 180, φ2 * 180 / Math.PI]; // normalise to −180..+180°
}
