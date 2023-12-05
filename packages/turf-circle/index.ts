import { GeoJsonProperties, Feature, Point, Polygon, BBox } from "geojson";
import destination from "@turf/destination";
import { Id, polygon, Units } from "@turf/helpers";

/**
 * Takes a {@link Point} and calculates the circle polygon given a radius in degrees, radians, miles, or kilometers; and steps for precision.
 *
 * @name circle
 * @param {Feature<Point>|number[]} center center point
 * @param {number} radius radius of the circle
 * @param {Object} [options={}] Optional parameters
 * @param {number} [options.steps=64] number of steps
 * @param {string} [options.units='kilometers'] miles, kilometers, degrees, or radians
 * @param {Object} [options.properties={}] properties
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] to assign to the resulting circle Feature
 * @param {string|number} [options.id] Identifier to assign to the resulting circle feature
 * @returns {Feature<Polygon>} circle polygon
 * @example
 * var center = [-75.343, 39.984];
 * var radius = 5;
 * var options = {steps: 10, units: 'kilometers', properties: {foo: 'bar'}};
 * var circle = turf.circle(center, radius, options);
 *
 * //addToMap
 * var addToMap = [turf.point(center), circle]
 */
function circle<P extends GeoJsonProperties = GeoJsonProperties>(
  center: number[] | Point | Feature<Point, P>,
  radius: number,
  options: {
    steps?: number;
    units?: Units;
    properties?: P;
    bbox?: BBox;
    id?: Id;
  } = {}
): Feature<Polygon, P> {
  // default params
  const steps = options.steps || 64;
  const stepAngle = -360 / steps;

  let properties = options.properties;
  let bboxValue: BBox | undefined;
  let idValue: Id | undefined;

  if (!Array.isArray(center) && center.type === "Feature") {
    properties = properties || center.properties;
    idValue = center.id;
  }

  bboxValue = bboxValue || options.bbox;
  idValue = idValue || options.id;
  // Calculate circle coordinates
  const coordinates = [];
  for (let i = 0; i < steps; i++) {
    coordinates.push(
      destination(center, radius, i * stepAngle, options).geometry.coordinates
    );
  }
  coordinates.push(coordinates[0]);

  return polygon([coordinates], properties, { bbox: bboxValue, id: idValue });
}

export { circle };
export default circle;
