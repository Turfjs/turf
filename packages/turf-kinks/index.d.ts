/// <reference types="geojson" />

type LineString = GeoJSON.Feature<GeoJSON.LineString> | GeoJSON.LineString;
type MultiLineString = GeoJSON.Feature<GeoJSON.MultiLineString> | GeoJSON.MultiLineString;
type Polygon = GeoJSON.Feature<GeoJSON.Polygon> | GeoJSON.Polygon;
type MultiPolygon = GeoJSON.Feature<GeoJSON.MultiPolygon> | GeoJSON.MultiPolygon;
type Points = GeoJSON.FeatureCollection<GeoJSON.Point>;

interface Kinks {
    /**
     * http://turfjs.org/docs/#kinks
     */
    (featureIn: LineString): Points;
    (featureIn: MultiLineString): Points;
    (featureIn: Polygon): Points;
    (featureIn: MultiPolygon): Points;
}
declare const kinks: Kinks;
export = kinks;
