/// <reference types="geojson" />

type Points = GeoJSON.FeatureCollection<GeoJSON.Point>;
type LineString = GeoJSON.Feature<GeoJSON.LineString> | GeoJSON.LineString;
type Point = GeoJSON.Feature<GeoJSON.Point>;

/**
 * http://turfjs.org/docs/#nearestpointtoline
 */
declare function nearestPointToLine(points: Points, line: LineString): Point;
declare namespace nearestPointToLine { }
export = nearestPointToLine;
