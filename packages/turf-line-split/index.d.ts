import {
  Feature,
  FeatureCollection,
  Point,
  MultiPoint,
  LineString,
  MultiLineString,
  Polygon,
  MultiPolygon,
} from "@turf/helpers";

export type Splitter = Feature<
  Point | MultiPoint | LineString | MultiLineString | Polygon | MultiPolygon
>;

/**
 * http://turfjs.org/docs/#linesplit
 */
export default function lineSplit<T extends LineString>(
  line: Feature<T> | T,
  splitter: Splitter
): FeatureCollection<T>;
