/// <reference types="geojson" />

type Point = GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point;
type Line = GeoJSON.Feature<GeoJSON.LineString> | GeoJSON.LineString;

/**
 * http://turfjs.org/docs/#booleanpointonline
 */
export default function (point: Point, linestring: Line, ignoreEndVertices?: boolean): boolean;
