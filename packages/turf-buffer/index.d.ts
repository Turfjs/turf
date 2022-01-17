import {
  Point,
  LineString,
  Polygon,
  MultiPoint,
  MultiLineString,
  MultiPolygon,
  GeometryObject,
  GeometryCollection,
  Feature,
  FeatureCollection,
} from "geojson";
import { Units } from "@turf/helpers";

interface Options {
  units?: Units;
  steps?: number;
}

/**
 * http://turfjs.org/docs/#buffer
 */
declare function buffer(
  feature:
    | Feature<GeometryObject>
    | Point
    | LineString
    | Polygon
    | MultiPoint
    | MultiLineString
    | MultiPolygon,
  radius?: number,
  options?: Options
): Feature<Polygon | MultiPolygon>;
declare function buffer(
  feature: FeatureCollection<GeometryObject> | GeometryCollection,
  radius?: number,
  options?: Options
): FeatureCollection<Polygon | MultiPolygon>;

export default buffer;
