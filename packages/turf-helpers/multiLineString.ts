import type {
  BBox,
  Feature,
  MultiLineString,
  Position,
  GeoJsonProperties,
} from "geojson";
import { feature } from "./feature.js";
import type { Id } from "./lib/geojson.js";

/**
 * Creates a {@link Feature<MultiLineString>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name multiLineString
 * @param {Array<Array<Array<number>>>} coordinates an array of LineStrings
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<MultiLineString>} a MultiLineString feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var multiLine = turf.multiLineString([[[0,0],[10,10]]]);
 *
 * //=multiLine
 */
export function multiLineString<
  P extends GeoJsonProperties = GeoJsonProperties,
>(
  coordinates: Position[][],
  properties?: P,
  options: { bbox?: BBox; id?: Id } = {}
): Feature<MultiLineString, P> {
  const geom: MultiLineString = {
    type: "MultiLineString",
    coordinates,
  };
  return feature(geom, properties, options);
}
