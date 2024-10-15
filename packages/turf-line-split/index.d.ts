import {
  Feature,
  FeatureCollection,
  Point,
  MultiPoint,
  LineString,
  MultiLineString,
  Polygon,
  MultiPolygon,
} from "geojson";

declare type Splitter = Feature<
  Point | MultiPoint | LineString | MultiLineString | Polygon | MultiPolygon
>;

/**
 * http://turfjs.org/docs/#linesplit
 */
declare function lineSplit<T extends LineString>(
  line: Feature<T> | T,
  splitter: Splitter
): FeatureCollection<T>;

export { Splitter, lineSplit };
export default lineSplit;
