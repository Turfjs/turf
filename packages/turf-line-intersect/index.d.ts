/// <reference types="geojson" />

export type LineTypes = GeoJSON.LineString | GeoJSON.MultiLineString | GeoJSON.Polygon | GeoJSON.MultiPolygon;
export type Line = GeoJSON.Feature<LineTypes> | GeoJSON.FeatureCollection<LineTypes> | LineTypes;
export type Points = GeoJSON.FeatureCollection<GeoJSON.Point>;

/**
 * http://turfjs.org/docs/#lineintersect
 */
export default function lineIntersect(line1: Line, line2: Line): Points;
