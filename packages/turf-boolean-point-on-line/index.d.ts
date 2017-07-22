/// <reference types="geojson" />

type Point = GeoJSON.Feature<Point> | GeoJSON.GeometryObject;
type LineString = GeoJSON.Feature<LineString> | GeoJSON.GeometryObject;

/**
 * http://turfjs.org/docs/#booleanpointonline
 */
declare function booleanPointOnLine(feature1: Point, feature2: LineString, ignoreEndVertices: boolean): boolean;
declare namespace booleanPointOnLine { }
export = booleanPointOnLine;
