// Use @types/geojson as foundation
import {
  BBox,
  LineString,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon,
  GeoJsonTypes,
} from "geojson";

export {
  BBox,
  Feature,
  FeatureCollection,
  Geometry,
  GeometryCollection,
  GeometryObject,
  LineString,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon,
  Position,
} from "geojson";

// Export additional types (historical).  These will be removed.

// /**
//  * GeometryTypes
//  *
//  * https://tools.ietf.org/html/rfc7946#section-1.4
//  * The valid values for the "type" property of GeoJSON geometry objects.
//  */
export type GeometryTypes =
  | "Point"
  | "LineString"
  | "Polygon"
  | "MultiPoint"
  | "MultiLineString"
  | "MultiPolygon"
  | "GeometryCollection";

export type CollectionTypes = "FeatureCollection" | "GeometryCollection";

// /**
//  * Types
//  *
//  * https://tools.ietf.org/html/rfc7946#section-1.4
//  * The value values for the "type" property of GeoJSON Objects.
//  */
export type Types = "Feature" | GeometryTypes | CollectionTypes;

// /**
//  * Id
//  *
//  * https://tools.ietf.org/html/rfc7946#section-3.2
//  * If a Feature has a commonly used identifier, that identifier SHOULD be included as a member of
//  * the Feature object with the name "id", and the value of this member is either a JSON string or number.
//  */
export type Id = string | number;

// /**
//  * Properties
//  *
//  * https://tools.ietf.org/html/rfc7946#section-3.2
//  * A Feature object has a member with the name "properties".
//  * The value of the properties member is an object (any JSON object or a JSON null value).
//  */
export type Properties = { [name: string]: any } | null;

// /**
//  * Geometries
//  */
export type Geometries =
  | Point
  | LineString
  | Polygon
  | MultiPoint
  | MultiLineString
  | MultiPolygon;

// /**
//  * GeoJSON Object
//  *
//  * https://tools.ietf.org/html/rfc7946#section-3
//  * The GeoJSON specification also allows [foreign members](https://tools.ietf.org/html/rfc7946#section-6.1)
//  * Developers should use "&" type in TypeScript or extend the interface to add these foreign members.
//  */
export interface GeoJSONObject {
  // Don't include foreign members directly into this type def.
  // in order to preserve type safety.
  // [key: string]: any;
  /**
   * Specifies the type of GeoJSON object.
   */
  type: GeoJsonTypes;
  /**
   * Bounding box of the coordinate range of the object's Geometries, Features, or Feature Collections.
   * https://tools.ietf.org/html/rfc7946#section-5
   */
  bbox?: BBox;
}
