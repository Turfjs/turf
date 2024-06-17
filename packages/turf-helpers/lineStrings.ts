import type {
  BBox,
  FeatureCollection,
  LineString,
  Position,
  GeoJsonProperties,
} from "geojson";
import { lineString } from "./lineString.js";
import type { Id } from "./lib/geojson.js";
import { featureCollection } from "./featureCollection.js";

/**
 * Creates a {@link LineString} {@link FeatureCollection} from an Array of LineString coordinates.
 *
 * @name lineStrings
 * @param {Array<Array<Array<number>>>} coordinates an array of LinearRings
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north]
 * associated with the FeatureCollection
 * @param {string|number} [options.id] Identifier associated with the FeatureCollection
 * @returns {FeatureCollection<LineString>} LineString FeatureCollection
 * @example
 * var linestrings = turf.lineStrings([
 *   [[-24, 63], [-23, 60], [-25, 65], [-20, 69]],
 *   [[-14, 43], [-13, 40], [-15, 45], [-10, 49]]
 * ]);
 *
 * //=linestrings
 */
export function lineStrings<P extends GeoJsonProperties = GeoJsonProperties>(
  coordinates: Position[][],
  properties?: P,
  options: { bbox?: BBox; id?: Id } = {}
): FeatureCollection<LineString, P> {
  return featureCollection(
    coordinates.map((coords) => {
      return lineString(coords, properties);
    }),
    options
  );
}
