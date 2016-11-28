/// <reference types="geojson" />

type Points = GeoJSON.FeatureCollection<GeoJSON.Point>;
type LineStrings = GeoJSON.FeatureCollection<GeoJSON.LineString>;
type Polygons = GeoJSON.FeatureCollection<GeoJSON.Polygon>;
type MultiPoints = GeoJSON.FeatureCollection<GeoJSON.MultiPoint>;
type MultiLineStrings = GeoJSON.FeatureCollection<GeoJSON.MultiLineString>;
type MultiPolygons = GeoJSON.FeatureCollection<GeoJSON.MultiPolygon>;
type Features = GeoJSON.FeatureCollection<any>;

interface SampleStatic {
    /**
     * http://turfjs.org/docs/#sample
     */
    (features: Points, num: number): Points;
    (features: LineStrings, num: number): LineStrings;
    (features: Polygons, num: number): Polygons;
    (features: MultiPoints, num: number): MultiPoints;
    (features: MultiLineStrings, num: number): MultiLineStrings;
    (features: MultiPolygons, num: number): MultiPolygons;
    (features: Features, num: number): Features;
}
declare const sample: SampleStatic;
declare namespace sample { }
export = sample;