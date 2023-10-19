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
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<Polygon>} circle polygon
 */
function circle<P = GeoJsonProperties>(
  center: number[] | Point | Feature<Point, P>,
  radius: number,
  options: {
    steps?: number;
    units?: Units;
    properties?: P;
    bbox?: BBox;
    id?: Id
  } = {}
): Feature<Polygon, P> {
  // default params
  const steps = options.steps || 64;
  const stepAngle = -360 / steps;

  let properties: P | undefined = options.properties;
  let bboxValue: BBox | undefined;
  let idValue: Id | undefined;

  if (!Array.isArray(center) && center.type === "Feature") {
    properties = properties || center.properties;
    bboxValue = center.bbox;
    idValue = center.id;
  }

  bboxValue = bboxValue || options.bbox;
  idValue = idValue || options.id;

  let _options: { bbox?: BBox; id?: Id; } | undefined;
  if (bboxValue || idValue) {
    _options = {
      ...(bboxValue ? { bbox: bboxValue } : {}),
      ...(idValue ? { id: idValue } : {})
    };
  }

  // Calculate circle coordinates
  const coordinates = [];
  for (let i = 0; i < steps; i++) {
    coordinates.push(
      destination(center, radius, i * stepAngle, options).geometry.coordinates
    );
  }
  coordinates.push(coordinates[0]);

  return polygon([coordinates], properties, _options);
}

export default circle;
