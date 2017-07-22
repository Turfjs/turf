/// <reference types="geojson" />

type Point = GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point;
type LineString = GeoJSON.LineString;
type Line = GeoJSON.Feature<LineString> | LineString;

/**
 * http://turfjs.org/docs/#booleanpointonline
 */
declare function booleanPointOnLine(feature1: Point, feature2: Line, ignoreEndVertices: boolean): boolean;
declare namespace booleanPointOnLine { }
export = booleanPointOnLine;
