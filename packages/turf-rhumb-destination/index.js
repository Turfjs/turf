// https://en.wikipedia.org/wiki/Rhumb_line
import { earthRadius, point, convertLength, degreesToRadians, isObject } from '@turf/helpers';
import { getCoord } from '@turf/invariant';

/**
 * Returns the destination {@link Point} having travelled the given distance along a Rhumb line from the
 * origin Point with the (varant) given bearing.
 *
 * @name rhumbDestination
 * @param {Coord} origin starting point
 * @param {number} distance distance from the starting point
 * @param {number} bearing varant bearing angle ranging from -180 to 180 degrees from north
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.units='kilometers'] can be degrees, radians, miles, or kilometers
 * @param {Object} [options.properties={}] translate properties to destination point
 * @returns {Feature<Point>} Destination point.
 * @example
 * var pt = turf.point([-75.343, 39.984], {"marker-color": "F00"});
 * var distance = 50;
 * var bearing = 90;
 * var options = {units: 'miles'};
 *
 * var destination = turf.rhumbDestination(pt, distance, bearing, options);
 *
 * //addToMap
 * var addToMap = [pt, destination]
 * destination.properties['marker-color'] = '#00F';
 */
function rhumbDestination(origin, distance, bearing, options) {
    // Optional parameters
    options = options || {};
    if (!isObject(options)) throw new Error('options is invalid');
    var units = options.units;
    var properties = options.properties;

    // validation
    if (!origin) throw new Error('origin is required');
    if (distance === undefined || distance === null) throw new Error('distance is required');
    if (bearing === undefined || bearing === null) throw new Error('bearing is required');
    if (!(distance >= 0)) throw new Error('distance must be greater than 0');

    var distanceInMeters = convertLength(distance, units, 'meters');
    var coords = getCoord(origin);
    var destination = calculateRhumbDestination(coords, distanceInMeters, bearing);

    // compensate the crossing of the 180th meridian (https://macwright.org/2016/09/26/the-180th-meridian.html)
    // solution from https://github.com/mapbox/mapbox-gl-js/issues/3250#issuecomment-294887678
    destination[0] += (destination[0] - coords[0] > 180) ? -360 : (coords[0] - destination[0] > 180) ? 360 : 0;
    return point(destination, properties);
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
function calculateRhumbDestination(origin, distance, bearing, radius) {
    // φ => phi
    // λ => lambda
    // ψ => psi
    // Δ => Delta
    // δ => delta
    // θ => theta

    radius = (radius === undefined) ? earthRadius : Number(radius);

    var delta = distance / radius; // angular distance in radians
    var lambda1 = origin[0] * Math.PI / 180; // to radians, but without normalize to 𝜋
    var phi1 = degreesToRadians(origin[1]);
    var theta = degreesToRadians(bearing);

    var DeltaPhi = delta * Math.cos(theta);
    var phi2 = phi1 + DeltaPhi;

    // check for some daft bugger going past the pole, normalise latitude if so
    if (Math.abs(phi2) > Math.PI / 2) phi2 = phi2 > 0 ? Math.PI - phi2 : -Math.PI - phi2;

    var DeltaPsi = Math.log(Math.tan(phi2 / 2 + Math.PI / 4) / Math.tan(phi1 / 2 + Math.PI / 4));
    var q = Math.abs(DeltaPsi) > 10e-12 ? DeltaPhi / DeltaPsi : Math.cos(phi1); // E-W course becomes ill-conditioned with 0/0

    var DeltaLambda = delta * Math.sin(theta) / q;
    var lambda2 = lambda1 + DeltaLambda;

    return [((lambda2 * 180 / Math.PI) + 540) % 360 - 180, phi2 * 180 / Math.PI]; // normalise to −180..+180°
}

export default rhumbDestination;
