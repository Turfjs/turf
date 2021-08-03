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
  Units,
} from "@turf/helpers";

interface Options {
  units?: Units;
  steps?: number;
}

/**
 * http://turfjs.org/docs/#buffer
 */
declare function buffer<Geom extends Point | LineString | Polygon>(
  feature: Feature<Geom> | Geom,
  radius?: number,
  options?: Options
): Feature<Polygon>;
declare function buffer<
  Geom extends MultiPoint | MultiLineString | MultiPolygon
>(
  feature: Feature<Geom> | Geom,
  radius?: number,
  options?: Options
): Feature<MultiPolygon>;
declare function buffer<Geom extends Point | LineString | Polygon>(
  feature: FeatureCollection<Geom>,
  radius?: number,
  options?: Options
): FeatureCollection<Polygon>;
declare function buffer<
  Geom extends MultiPoint | MultiLineString | MultiPolygon
>(
  feature: FeatureCollection<Geom>,
  radius?: number,
  options?: Options
): FeatureCollection<MultiPolygon>;
declare function buffer(
  feature:
    | FeatureCollection<any>
    | Feature<GeometryCollection>
    | GeometryCollection,
  radius?: number,
  options?: Options
): FeatureCollection<Polygon | MultiPolygon>;
declare function buffer(
  feature: Feature<any> | GeometryObject,
  radius?: number,
  options?: Options
): Feature<Polygon | MultiPolygon>;

export default buffer;
