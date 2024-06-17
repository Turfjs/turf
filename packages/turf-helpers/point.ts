import type {
  BBox,
  Feature,
  Point,
  Position,
  GeoJsonProperties,
} from "geojson";
import { feature } from "./feature.js";
import type { Id } from "./lib/geojson.js";
import { isNumber } from "./isNumber.js";

/**
 * Creates a {@link Point} {@link Feature} from a Position.
 *
 * @name point
 * @param {Array<number>} coordinates longitude, latitude position (each in decimal degrees)
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<Point>} a Point feature
 * @example
 * var point = turf.point([-75.343, 39.984]);
 *
 * //=point
 */
export function point<P extends GeoJsonProperties = GeoJsonProperties>(
  coordinates: Position,
  properties?: P,
  options: { bbox?: BBox; id?: Id } = {}
): Feature<Point, P> {
  if (!coordinates) {
    throw new Error("coordinates is required");
  }
  if (!Array.isArray(coordinates)) {
    throw new Error("coordinates must be an Array");
  }
  if (coordinates.length < 2) {
    throw new Error("coordinates must be at least 2 numbers long");
  }
  if (!isNumber(coordinates[0]) || !isNumber(coordinates[1])) {
    throw new Error("coordinates must contain numbers");
  }

  const geom: Point = {
    type: "Point",
    coordinates,
  };
  return feature(geom, properties, options);
}
