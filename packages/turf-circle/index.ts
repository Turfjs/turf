import { GeoJsonProperties, Feature, Point, Polygon, Position } from "geojson";
import { destination } from "@turf/destination";
import { polygon, Units } from "@turf/helpers";

/**
 * Takes a {@link Point} and calculates the circle polygon given a radius in degrees, radians, miles, or kilometers; and steps for precision.
 *
 * @function
 * @param {Position|Point|Feature<Point>} center Center point
 * @param {number} radius Radius of the circle
 * @param {Object} [options={}] Optional parameters
 * @param {number} [options.steps=64] Number of steps
 * @param {Units} [options.units='kilometers'] Units in which linear values are expressed
 * @param {GeoJsonProperties} [options.properties={}] Properties to set on returned feature
 * @returns {Feature<Polygon>} Circle polygon
 * @example
 * const center = [-75.343, 39.984];
 * const radius = 5;
 * const options = {steps: 10, units: 'kilometers', properties: {foo: 'bar'}};
 * const circle = turf.circle(center, radius, options);
 *
 * //addToMap
 * const addToMap = [turf.point(center), circle]
 */
function circle<P extends GeoJsonProperties = GeoJsonProperties>(
  center: Position | Point | Feature<Point, P>,
  radius: number,
  options: {
    steps?: number;
    units?: Units;
    properties?: P;
  } = {}
): Feature<Polygon, P> {
  // default params
  const steps = options.steps || 64;
  const properties: any = options.properties
    ? options.properties
    : !Array.isArray(center) && center.type === "Feature" && center.properties
      ? center.properties
      : {};

  // main
  const coordinates = [];
  for (let i = 0; i < steps; i++) {
    coordinates.push(
      destination(center, radius, (i * -360) / steps, options).geometry
        .coordinates
    );
  }
  coordinates.push(coordinates[0]);

  return polygon([coordinates], properties);
}

export { circle };
export default circle;
