// Use @types/geojson as foundation

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

/**
 * Id
 *
 * https://tools.ietf.org/html/rfc7946#section-3.2
 * If a Feature has a commonly used identifier, that identifier SHOULD be included as a member of
 * the Feature object with the name "id", and the value of this member is either a JSON string or number.
 */
export type Id = string | number;
