import {LineString, LineStrings} from '@turf/helpers';

type Splitter = GeoJSON.Feature<
  GeoJSON.Point | GeoJSON.MultiPoint |
  GeoJSON.LineString | GeoJSON.MultiLineString |
  GeoJSON.Polygon | GeoJSON.MultiPolygon
>

/**
 * http://turfjs.org/docs/#linesplit
 */
declare function lineSplit(line: LineString, splitter: Splitter): LineStrings;
declare namespace lineSplit { }
export = lineSplit;
