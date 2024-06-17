import type {
  BBox,
  FeatureCollection,
  Point,
  Position,
  GeoJsonProperties,
} from "geojson";
import type { Id } from "./lib/geojson.js";
import { featureCollection } from "./featureCollection.js";
import { point } from "./point.js";

/**
 * Creates a {@link Point} {@link FeatureCollection} from an Array of Point coordinates.
 *
 * @name points
 * @param {Array<Array<number>>} coordinates an array of Points
 * @param {Object} [properties={}] Translate these properties to each Feature
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north]
 * associated with the FeatureCollection
 * @param {string|number} [options.id] Identifier associated with the FeatureCollection
 * @returns {FeatureCollection<Point>} Point Feature
 * @example
 * var points = turf.points([
 *   [-75, 39],
 *   [-80, 45],
 *   [-78, 50]
 * ]);
 *
 * //=points
 */
export function points<P extends GeoJsonProperties = GeoJsonProperties>(
  coordinates: Position[],
  properties?: P,
  options: { bbox?: BBox; id?: Id } = {}
): FeatureCollection<Point, P> {
  return featureCollection(
    coordinates.map((coords) => {
      return point(coords, properties);
    }),
    options
  );
}
