import type {
  BBox,
  Feature,
  Geometry,
  GeometryObject,
  GeoJsonProperties,
} from "geojson";
import type { Id } from "./lib/geojson.js";

/**
 * Wraps a GeoJSON {@link Geometry} in a GeoJSON {@link Feature}.
 *
 * @name feature
 * @param {Geometry} geometry input geometry
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature} a GeoJSON Feature
 * @example
 * var geometry = {
 *   "type": "Point",
 *   "coordinates": [110, 50]
 * };
 *
 * var feature = turf.feature(geometry);
 *
 * //=feature
 */
export function feature<
  G extends GeometryObject = Geometry,
  P extends GeoJsonProperties = GeoJsonProperties,
>(
  geom: G | null,
  properties?: P,
  options: { bbox?: BBox; id?: Id } = {}
): Feature<G, P> {
  const feat: any = { type: "Feature" };
  if (options.id === 0 || options.id) {
    feat.id = options.id;
  }
  if (options.bbox) {
    feat.bbox = options.bbox;
  }
  feat.properties = properties || {};
  feat.geometry = geom;
  return feat;
}
