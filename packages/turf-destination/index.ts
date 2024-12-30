// http://en.wikipedia.org/wiki/Haversine_formula
// http://www.movable-type.co.uk/scripts/latlong.html
import { Feature, Point, GeoJsonProperties } from "geojson";
import {
  Coord,
  degreesToRadians,
  lengthToRadians,
  point,
  radiansToDegrees,
  Units,
} from "@turf/helpers";
import { getCoord } from "@turf/invariant";

/**
 * Takes a {@link Point} and calculates the location of a destination point given a distance in
 * degrees, radians, miles, or kilometers; and bearing in degrees.
 * This uses the [Haversine formula](http://en.wikipedia.org/wiki/Haversine_formula) to account for global curvature.
 *
 * @function
 * @param {Coord} origin starting point
 * @param {number} distance distance from the origin point
 * @param {number} bearing ranging from -180 to 180
 * @param {Object} [options={}] Optional parameters
 * @param {Units} [options.units='kilometers'] Units in which linear values are expressed
 * @param {GeoJsonProperties} [options.properties={}] Properties to set on returned feature
 * @returns {Feature<Point>} destination point
 * @example
 * const point = turf.point([-75.343, 39.984]);
 * const distance = 50;
 * const bearing = 90;
 * const options = {units: 'miles'};
 *
 * const destination = turf.destination(point, distance, bearing, options);
 *
 * //addToMap
 * const addToMap = [point, destination]
 * destination.properties['marker-color'] = '#f00';
 * point.properties['marker-color'] = '#0f0';
 */
function destination<P extends GeoJsonProperties = GeoJsonProperties>(
  origin: Coord,
  distance: number,
  bearing: number,
  options: {
    units?: Units;
    properties?: P;
  } = {}
): Feature<Point, P> {
  // Handle input
  const coordinates1 = getCoord(origin);
  const longitude1 = degreesToRadians(coordinates1[0]);
  const latitude1 = degreesToRadians(coordinates1[1]);
  const bearingRad = degreesToRadians(bearing);
  const radians = lengthToRadians(distance, options.units);

  // Main
  const latitude2 = Math.asin(
    Math.sin(latitude1) * Math.cos(radians) +
      Math.cos(latitude1) * Math.sin(radians) * Math.cos(bearingRad)
  );
  const longitude2 =
    longitude1 +
    Math.atan2(
      Math.sin(bearingRad) * Math.sin(radians) * Math.cos(latitude1),
      Math.cos(radians) - Math.sin(latitude1) * Math.sin(latitude2)
    );
  const lng = radiansToDegrees(longitude2);
  const lat = radiansToDegrees(latitude2);

  return point([lng, lat], options.properties);
}

export { destination };
export default destination;
