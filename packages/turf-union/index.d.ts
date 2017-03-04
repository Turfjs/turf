/// <reference types="geojson" />

type LineString = GeoJSON.Feature<GeoJSON.LineString>;
type Polygon = GeoJSON.Feature<GeoJSON.Polygon>;
type MultiLineString = GeoJSON.Feature<GeoJSON.MultiLineString>;
type MultiPolygon = GeoJSON.Feature<GeoJSON.MultiPolygon>;
type LineStrings = GeoJSON.FeatureCollection<GeoJSON.LineString>;
type Polygons = GeoJSON.FeatureCollection<GeoJSON.Polygon>;
type MultiLineStrings = GeoJSON.FeatureCollection<GeoJSON.MultiLineString>;
type MultiPolygons = GeoJSON.FeatureCollection<GeoJSON.MultiPolygon>;
type Features = GeoJSON.FeatureCollection<any>;
type GeometryCollection = GeoJSON.GeometryCollection;

interface UnionStatic {
    /**
     * http://turfjs.org/docs/#union
     */
    
    (...features: Polygon[]): Polygon|MultiPolygon;
}
declare const union: UnionStatic;
declare namespace union { }
export = union;
