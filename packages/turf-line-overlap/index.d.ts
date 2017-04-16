/// <reference types="geojson" />

type LineStrings = GeoJSON.FeatureCollection<GeoJSON.LineString>;
type Line = GeoJSON.Feature<GeoJSON.LineString | GeoJSON.MultiLineString | GeoJSON.Polygon | GeoJSON.MultiPolygon>;

/**
 * http://turfjs.org/docs/#lineoverlap
 */
declare function lineOverlap(source: Line, target: Line, precision?: number): LineStrings;
declare namespace lineOverlap {}
export = lineOverlap;
