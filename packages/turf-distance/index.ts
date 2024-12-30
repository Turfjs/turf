import { getCoord } from "@turf/invariant";
import { radiansToLength, degreesToRadians, Coord, Units } from "@turf/helpers";

//http://en.wikipedia.org/wiki/Haversine_formula
//http://www.movable-type.co.uk/scripts/latlong.html

/**
 * Calculates the distance between two {@link Coord|coordinates} in degrees, radians, miles, or kilometers.
 * This uses the [Haversine formula](http://en.wikipedia.org/wiki/Haversine_formula) to account for global curvature.
 *
 * @function
 * @param {Coord} from origin coordinate
 * @param {Coord} to destination coordinate
 * @param {Object} [options={}] Optional parameters
 * @param {Units} [options.units='kilometers'] Units in which linear values are expressed
 * @returns {number} distance between the two coordinates
 * @example
 * const from = turf.point([-75.343, 39.984]);
 * const to = turf.point([-75.534, 39.123]);
 * const options = {units: 'miles'};
 *
 * const distance = turf.distance(from, to, options);
 *
 * //addToMap
 * const addToMap = [from, to];
 * from.properties.distance = distance;
 * to.properties.distance = distance;
 */
function distance(
  from: Coord,
  to: Coord,
  options: {
    units?: Units;
  } = {}
) {
  var coordinates1 = getCoord(from);
  var coordinates2 = getCoord(to);
  var dLat = degreesToRadians(coordinates2[1] - coordinates1[1]);
  var dLon = degreesToRadians(coordinates2[0] - coordinates1[0]);
  var lat1 = degreesToRadians(coordinates1[1]);
  var lat2 = degreesToRadians(coordinates2[1]);

  var a =
    Math.pow(Math.sin(dLat / 2), 2) +
    Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);

  return radiansToLength(
    2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)),
    options.units
  );
}

export { distance };
export default distance;
