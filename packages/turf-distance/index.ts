import { Point } from "geojson";
import { getCoord } from "@turf/invariant";
import {
  radiansToLength,
  degreesToRadians,
  datums,
  Coord,
  Datum,
  Units,
  convertLength,
} from "@turf/helpers";
const LatLon = require("geodesy").LatLonEllipsoidal;

//http://en.wikipedia.org/wiki/Haversine_formula
//http://www.movable-type.co.uk/scripts/latlong.html

/**
 * Calculates the distance between two {@link Point|points}.
 * If a specific datum is passed, uses a geodesic ellipsoid calculation.
 * If no datum is passed, performs a great circle calculation.
 *
 * @name distance
 * @param {Coord | Point} from origin point or coordinate
 * @param {Coord | Point} to destination point or coordinate
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.units='kilometers'] can be degrees, radians, miles, or kilometers
 * @param {Datum} [options.datum=datums.WGS84] datum listed in {@link Helpers}
 * @returns {number} distance between the two points in chosen units
 * @example
 * var from = turf.point([-75.343, 39.984]);
 * var to = turf.point([-75.534, 39.123]);
 *
 * var options = {units: 'miles'};
 * var distance = turf.distance(from, to, options);
 *
 * //addToMap
 * var addToMap = [from, to];
 * from.properties.distance = distance;
 * to.properties.distance = distance;
 */
function distance(
  from: Coord | Point,
  to: Coord | Point,
  options: {
    units?: Units;
    datum?: Datum;
  } = {}
) {
  if (options?.datum) {
    return geodesic_ellipsoid_distance(from, to, options);
  } else {
    return great_circle_distance(from, to, options);
  }
}

/**
 * Calculates the distance between two {@link Point|points} in degrees, radians, miles, or kilometers.
 * Performs a great circle calculation using the [Haversine formula](http://en.wikipedia.org/wiki/Haversine_formula) to account for global curvature.
 *
 * @name distance
 * @param {Coord | Point} from origin point or coordinate
 * @param {Coord | Point} to destination point or coordinate
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.units='kilometers'] can be degrees, radians, miles, or kilometers
 * @returns {number} distance between the two points
 * @example
 * var from = turf.point([-75.343, 39.984]);
 * var to = turf.point([-75.534, 39.123]);
 * var options = {units: 'miles'};
 *
 * var distance = turf.distance(from, to, options);
 *
 * //addToMap
 * var addToMap = [from, to];
 * from.properties.distance = distance;
 * to.properties.distance = distance;
 */
function great_circle_distance(
  from: Coord | Point,
  to: Coord | Point,
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

/**
 * Calculates the distance between two {@link Point|points}.
 * Performs a geodesic ellipsoid calculation using [Vincenty's formulae](https://en.wikipedia.org/wiki/Vincenty%27s_formulae) to account for speroidal curvature.
 *
 * @name geodesic_ellipsoid_distance
 * @param {Coord | Point} from origin point or coordinate
 * @param {Coord | Point} to destination point or coordinate
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.units='kilometers'] can be degrees, radians, miles, or kilometers
 * @param {Datum} [options.datum=datums.WGS84] datum listed in {@link Helpers}
 * @returns {number} distance between the two points in chosen units
 * @example
 * var from = turf.point([-75.343, 39.984]);
 * var to = turf.point([-75.534, 39.123]);
 * var options = {units: 'miles', datum: datums.WGS84};
 *
 * var distance = turf.distance(from, to, options);
 *
 * //addToMap
 * var addToMap = [from, to];
 * from.properties.distance = distance;
 * to.properties.distance = distance;
 */
function geodesic_ellipsoid_distance(
  from: Coord | Point,
  to: Coord | Point,
  options: {
    units?: Units;
    datum?: Datum;
  } = {}
) {
  const fromCoord = getCoord(from);
  const toCoord = getCoord(to);
  const fromLatLon = new LatLon(fromCoord[1], fromCoord[0]);
  const toLatLon = new LatLon(toCoord[1], toCoord[0]);

  if (options?.datum) {
    // datum on from point sets the tone.
    fromLatLon.datum = options.datum;
  } else {
    fromLatLon.datum = datums.WGS84;
  }

  const meters = fromLatLon.distanceTo(toLatLon);
  // geodesy lib result is in meters
  return convertLength(meters, "meters", options.units);
}

export { great_circle_distance, geodesic_ellipsoid_distance };
export default distance;
