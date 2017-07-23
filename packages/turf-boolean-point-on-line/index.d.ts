/// <reference types="geojson" />

type Point = GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point;
type Line = GeoJSON.Feature<GeoJSON.LineString> | GeoJSON.LineString;

/**
 * http://turfjs.org/docs/#booleanpointonline
 */
declare function booleanPointOnLine(point: Point, linestring: Line, ignoreEndVertices?: boolean): boolean;
declare namespace booleanPointOnLine { }
export = booleanPointOnLine;
