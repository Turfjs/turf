import type {
  BBox,
  Feature,
  MultiPoint,
  Position,
  GeoJsonProperties,
} from "geojson";
import { feature } from "./feature.js";
import type { Id } from "./lib/geojson.js";

/**
 * Creates a {@link Feature<MultiPoint>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name multiPoint
 * @param {Array<Array<number>>} coordinates an array of Positions
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<MultiPoint>} a MultiPoint feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var multiPt = turf.multiPoint([[0,0],[10,10]]);
 *
 * //=multiPt
 */
export function multiPoint<P extends GeoJsonProperties = GeoJsonProperties>(
  coordinates: Position[],
  properties?: P,
  options: { bbox?: BBox; id?: Id } = {}
): Feature<MultiPoint, P> {
  const geom: MultiPoint = {
    type: "MultiPoint",
    coordinates,
  };
  return feature(geom, properties, options);
}
