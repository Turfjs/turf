/// <reference types="geojson" />

type Point = GeoJSON.Feature<GeoJSON.Point>;
type LineString = GeoJSON.Feature<GeoJSON.LineString>;

/**
 * http://turfjs.org/docs/#pointonline
 */
declare function pointOnLine(line: LineString, point: Point, units?: string): Point;
declare namespace pointOnLine { }
export = pointOnLine;
