/// <reference types="geojson" />

type Points = GeoJSON.FeatureCollection<GeoJSON.Point>;
type LineStrings = GeoJSON.FeatureCollection<GeoJSON.LineString>;
type Polygons = GeoJSON.FeatureCollection<GeoJSON.Polygon>;
type MultiPoints = GeoJSON.FeatureCollection<GeoJSON.MultiPoint>;
type MultiLineStrings = GeoJSON.FeatureCollection<GeoJSON.MultiLineString>;
type MultiPolygons = GeoJSON.FeatureCollection<GeoJSON.MultiPolygon>;
type Features = GeoJSON.FeatureCollection<any>;

interface CombineStatic {
    /**
     * http://turfjs.org/docs/#combine
     */
    (features: Points): MultiPoints;
    (features: LineStrings): MultiLineStrings;
    (features: Polygons): MultiPolygons;
    (features: Features): Features;
}
declare const combine: CombineStatic;
declare namespace combine { }
export = combine;