/// <reference types="geojson" />

type Polygon = GeoJSON.Feature<GeoJSON.Polygon> | GeoJSON.Polygon;
type LineString = GeoJSON.Feature<GeoJSON.LineString> | GeoJSON.LineString;
type MultiLineString = GeoJSON.Feature<GeoJSON.MultiLineString> | GeoJSON.MultiLineString;
type MultiPolygon = GeoJSON.Feature<GeoJSON.MultiPolygon> | GeoJSON.MultiPolygon;
type Rewind = Polygon | LineString | MultiLineString | MultiPolygon;

/**
 * http://turfjs.org/docs/#rewind
 */
declare function rewind<Input extends Rewind>(geojson: Input, reversed?: boolean, mutate?: boolean): Input;
declare namespace rewind { }
export = rewind;
