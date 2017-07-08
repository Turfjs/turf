/// <reference types="geojson" />

// Geometry Types
type MultiLineString = GeoJSON.MultiLineString
type LineString = GeoJSON.LineString
type Polygon = GeoJSON.Polygon
type MultiPolygon = GeoJSON.MultiPolygon

// Inputs
type Feature = GeoJSON.Feature<LineString | MultiLineString> | LineString | MultiLineString
type FeatureCollection = GeoJSON.FeatureCollection<LineString | MultiLineString> | GeoJSON.GeometryCollection

/**
 * Output type changes based on input type
 *
 * Feature => Polygon
 * FeatureCollection => MultiPolygon
 */
interface lineStringToPolygon {
  (lines: Feature, properties?: any, autoComplete?: boolean, orderCoords?: boolean): GeoJSON.Feature<Polygon>
  (lines: FeatureCollection, properties?: any, autoComplete?: boolean, orderCoords?: boolean): GeoJSON.Feature<MultiPolygon>
}
declare const lineStringToPolygon: lineStringToPolygon;
export = lineStringToPolygon;
