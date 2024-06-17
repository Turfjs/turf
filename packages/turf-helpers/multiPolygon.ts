import type {
  BBox,
  Feature,
  MultiPolygon,
  Position,
  GeoJsonProperties,
} from "geojson";
import { feature } from "./feature.js";
import type { Id } from "./lib/geojson.js";

/**
 * Creates a {@link Feature<MultiPolygon>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name multiPolygon
 * @param {Array<Array<Array<Array<number>>>>} coordinates an array of Polygons
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<MultiPolygon>} a multipolygon feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var multiPoly = turf.multiPolygon([[[[0,0],[0,10],[10,10],[10,0],[0,0]]]]);
 *
 * //=multiPoly
 *
 */
export function multiPolygon<P extends GeoJsonProperties = GeoJsonProperties>(
  coordinates: Position[][][],
  properties?: P,
  options: { bbox?: BBox; id?: Id } = {}
): Feature<MultiPolygon, P> {
  const geom: MultiPolygon = {
    type: "MultiPolygon",
    coordinates,
  };
  return feature(geom, properties, options);
}
