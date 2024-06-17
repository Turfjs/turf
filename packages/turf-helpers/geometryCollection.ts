import type {
  BBox,
  Feature,
  GeometryCollection,
  LineString,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon,
  GeoJsonProperties,
} from "geojson";
import { feature } from "./feature.js";
import type { Id } from "./lib/geojson.js";

/**
 * Creates a {@link Feature<GeometryCollection>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name geometryCollection
 * @param {Array<Geometry>} geometries an array of GeoJSON Geometries
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<GeometryCollection>} a GeoJSON GeometryCollection Feature
 * @example
 * var pt = turf.geometry("Point", [100, 0]);
 * var line = turf.geometry("LineString", [[101, 0], [102, 1]]);
 * var collection = turf.geometryCollection([pt, line]);
 *
 * // => collection
 */
export function geometryCollection<
  P extends GeoJsonProperties = GeoJsonProperties,
>(
  geometries: Array<
    Point | LineString | Polygon | MultiPoint | MultiLineString | MultiPolygon
  >,
  properties?: P,
  options: { bbox?: BBox; id?: Id } = {}
): Feature<GeometryCollection, P> {
  const geom: GeometryCollection = {
    type: "GeometryCollection",
    geometries,
  };
  return feature(geom, properties, options);
}
