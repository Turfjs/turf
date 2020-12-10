// https://en.wikipedia.org/wiki/Rhumb_line
import { Coord, degreesToRadians, radiansToDegrees } from "@turf/helpers";
import { getCoord } from "@turf/invariant";

/**
 * Takes two {@link Point|points} and finds the bearing angle between them along a Rhumb line
 * i.e. the angle measured in degrees start the north line (0 degrees)
 *
 * @name rhumbBearing
 * @param {Coord} start starting Point
 * @param {Coord} end ending Point
 * @param {Object} [options] Optional parameters
 * @param {boolean} [options.final=false] calculates the final bearing if true
 * @returns {number} bearing from north in decimal degrees, between -180 and 180 degrees (positive clockwise)
 * @example
 * var point1 = turf.point([-75.343, 39.984], {"marker-color": "#F00"});
 * var point2 = turf.point([-75.534, 39.123], {"marker-color": "#00F"});
 *
 * var bearing = turf.rhumbBearing(point1, point2);
 *
 * //addToMap
 * var addToMap = [point1, point2];
 * point1.properties.bearing = bearing;
 * point2.properties.bearing = bearing;
 */
function rhumbBearing(
  start: Coord,
  end: Coord,
  options: { final?: boolean } = {}
): number {
  let bear360;
  if (options.final) {
    bear360 = calculateRhumbBearing(getCoord(end), getCoord(start));
  } else {
    bear360 = calculateRhumbBearing(getCoord(start), getCoord(end));
  }

  const bear180 = bear360 > 180 ? -(360 - bear360) : bear360;

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
 * var p1 = new LatLon(51.127, 1.338);
 * var p2 = new LatLon(50.964, 1.853);
 * var d = p1.rhumbBearingTo(p2); // 116.7 m
 */
function calculateRhumbBearing(from: number[], to: number[]) {
  // φ => phi
  // Δλ => deltaLambda
  // Δψ => deltaPsi
  // θ => theta
  const phi1 = degreesToRadians(from[1]);
  const phi2 = degreesToRadians(to[1]);
  let deltaLambda = degreesToRadians(to[0] - from[0]);
  // if deltaLambdaon over 180° take shorter rhumb line across the anti-meridian:
  if (deltaLambda > Math.PI) {
    deltaLambda -= 2 * Math.PI;
  }
  if (deltaLambda < -Math.PI) {
    deltaLambda += 2 * Math.PI;
  }

  const deltaPsi = Math.log(
    Math.tan(phi2 / 2 + Math.PI / 4) / Math.tan(phi1 / 2 + Math.PI / 4)
  );

  const theta = Math.atan2(deltaLambda, deltaPsi);

  return (radiansToDegrees(theta) + 360) % 360;
}

export default rhumbBearing;
