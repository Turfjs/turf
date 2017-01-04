/// <reference types="geojson" />

type LineString = GeoJSON.Feature<GeoJSON.LineString>;
type Polygon = GeoJSON.Feature<GeoJSON.Polygon>;
type MultiLineString = GeoJSON.Feature<GeoJSON.MultiLineString>;
type MultiPolygon = GeoJSON.Feature<GeoJSON.MultiPolygon>;
type LineStrings = GeoJSON.FeatureCollection<GeoJSON.LineString>;
type Polygons = GeoJSON.FeatureCollection<GeoJSON.Polygon>;
type MultiLineStrings = GeoJSON.FeatureCollection<GeoJSON.MultiLineString>;
type MultiPolygons = GeoJSON.FeatureCollection<GeoJSON.MultiPolygon>;
type Feature = GeoJSON.Feature<any>;
type Features = GeoJSON.FeatureCollection<any>;
type GeometryCollection = GeoJSON.GeometryCollection;

interface SimplifyStatic {
    /**
     * http://turfjs.org/docs/#simplify
     */

    (feature: LineString, tolerance?: number, highQuality?: boolean): LineString;
    (feature: LineStrings, tolerance?: number, highQuality?: boolean): LineStrings;
    (feature: Polygon, tolerance?: number, highQuality?: boolean): Polygon;
    (feature: Polygons, tolerance?: number, highQuality?: boolean): Polygons;
    (feature: MultiLineString, tolerance?: number, highQuality?: boolean): MultiLineString;
    (feature: MultiLineStrings, tolerance?: number, highQuality?: boolean): MultiLineStrings;
    (feature: MultiPolygon, tolerance?: number, highQuality?: boolean): MultiPolygon;
    (feature: MultiPolygons, tolerance?: number, highQuality?: boolean): MultiPolygons;
    (feature: GeometryCollection, tolerance?: number, highQuality?: boolean): GeometryCollection;
    (feature: Feature, tolerance?: number, highQuality?: boolean): Feature;
    (feature: Features, tolerance?: number, highQuality?: boolean): Features;
}
declare const simplify: SimplifyStatic;
declare namespace simplify { }
export = simplify;