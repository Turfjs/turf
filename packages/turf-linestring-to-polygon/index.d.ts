/// <reference types="geojson" />

// Geometry Types
export type MultiLineString = GeoJSON.MultiLineString
export type LineString = GeoJSON.LineString
export type Polygon = GeoJSON.Polygon
export type MultiPolygon = GeoJSON.MultiPolygon

// Inputs
export type Feature = GeoJSON.Feature<LineString | MultiLineString> | LineString | MultiLineString
export type FeatureCollection = GeoJSON.FeatureCollection<LineString | MultiLineString> | GeoJSON.GeometryCollection

/**
 * Output type changes based on input type
 *
 * Feature => Polygon
 * FeatureCollection => MultiPolygon
 */
declare function lineStringToPolygon(lines: Feature, properties?: any, autoComplete?: boolean, orderCoords?: boolean): GeoJSON.Feature<Polygon>
declare function lineStringToPolygon(lines: FeatureCollection, properties?: any, autoComplete?: boolean, orderCoords?: boolean): GeoJSON.Feature<MultiPolygon>

export default lineStringToPolygon;