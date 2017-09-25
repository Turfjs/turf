import { LineString, LineStrings } from '@turf/helpers';

export type Splitter = GeoJSON.Feature<
  GeoJSON.Point | GeoJSON.MultiPoint |
  GeoJSON.LineString | GeoJSON.MultiLineString |
  GeoJSON.Polygon | GeoJSON.MultiPolygon
>

/**
 * http://turfjs.org/docs/#linesplit
 */
export default function lineSplit(line: LineString, splitter: Splitter): LineStrings;
