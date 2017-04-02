/// <reference types="geojson" />

type LineTypes = GeoJSON.LineString | GeoJSON.MultiLineString | GeoJSON.Polygon | GeoJSON.MultiPolygon;
type Line = GeoJSON.Feature<LineTypes> | GeoJSON.FeatureCollection<LineTypes>;
type Points = GeoJSON.FeatureCollection<GeoJSON.Point>;

/**
 * http://turfjs.org/docs/#lineintersect
 */
declare function lineIntersect(line1: Line, line2: Line): Points;
declare namespace lineIntersect {}
export = lineIntersect;
