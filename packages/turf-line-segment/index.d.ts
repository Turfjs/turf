/// <reference types="geojson" />

export type LineString = GeoJSON.LineString;
export type MultiLineString = GeoJSON.MultiLineString;
export type Polygon = GeoJSON.Polygon;
export type MultiPolygon = GeoJSON.MultiPolygon;
export type GeometryObject = GeoJSON.GeometryObject;
export type GeometryCollection = GeoJSON.GeometryCollection;
export type Feature<Geom extends GeometryObject> = GeoJSON.Feature<Geom>;
export type FeatureCollection<Geom extends GeometryObject> = GeoJSON.FeatureCollection<Geom>;
export type Geoms = LineString | MultiLineString | Polygon | MultiPolygon;

// Not correctly supported in @types/geojson
export interface FeatureGeometryCollection extends Feature<any> {
  geometry: GeometryCollection
}

// Input & Output
export type Input = Feature<Geoms> | FeatureCollection<Geoms> | Geoms | GeometryCollection | FeatureGeometryCollection;
export type Output = FeatureCollection<LineString>;

/**
 * http://turfjs.org/docs/#linesegment
 */
export default function lineSegment(geojson: Input): Output;
