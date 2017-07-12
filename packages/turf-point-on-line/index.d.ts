/// <reference types="geojson" />

type Point = GeoJSON.Feature<GeoJSON.Point>;
type LineString = GeoJSON.Feature<GeoJSON.LineString>;
type MultiLineString = GeoJSON.MultiLineString;

/**
 * http://turfjs.org/docs/#pointonline
 */
declare function pointOnLine(line: LineString | MultiLineString, point: Point, units?: string): Point;
declare namespace pointOnLine { }
export = pointOnLine;
