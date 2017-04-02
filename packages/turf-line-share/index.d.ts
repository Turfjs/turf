/// <reference types="geojson" />

type LineStrings = GeoJSON.FeatureCollection<GeoJSON.LineString>;
type Line = GeoJSON.Feature<GeoJSON.LineString | GeoJSON.MultiLineString | GeoJSON.Polygon | GeoJSON.MultiPolygon>;

/**
 * http://turfjs.org/docs/#lineshare
 */
declare function lineShare(source: Line, target: Line, precision?: number): LineStrings;
declare namespace lineShare {}
export = lineShare;
