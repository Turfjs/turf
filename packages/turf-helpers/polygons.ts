import type {
  BBox,
  FeatureCollection,
  Polygon,
  Position,
  GeoJsonProperties,
} from "geojson";
import type { Id } from "./lib/geojson.js";
import { featureCollection } from "./featureCollection.js";
import { polygon } from "./polygon.js";

/**
 * Creates a {@link Polygon} {@link FeatureCollection} from an Array of Polygon coordinates.
 *
 * @name polygons
 * @param {Array<Array<Array<Array<number>>>>} coordinates an array of Polygon coordinates
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the FeatureCollection
 * @returns {FeatureCollection<Polygon>} Polygon FeatureCollection
 * @example
 * var polygons = turf.polygons([
 *   [[[-5, 52], [-4, 56], [-2, 51], [-7, 54], [-5, 52]]],
 *   [[[-15, 42], [-14, 46], [-12, 41], [-17, 44], [-15, 42]]],
 * ]);
 *
 * //=polygons
 */
export function polygons<P extends GeoJsonProperties = GeoJsonProperties>(
  coordinates: Position[][][],
  properties?: P,
  options: { bbox?: BBox; id?: Id } = {}
): FeatureCollection<Polygon, P> {
  return featureCollection(
    coordinates.map((coords) => {
      return polygon(coords, properties);
    }),
    options
  );
}
