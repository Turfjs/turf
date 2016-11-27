/// <reference types="geojson" />

type Points = GeoJSON.FeatureCollection<GeoJSON.Point>;
type Point = GeoJSON.Feature<GeoJSON.Point>;
type MultiPoints = GeoJSON.FeatureCollection<GeoJSON.MultiPoint>;
type MultiPoint = GeoJSON.Feature<GeoJSON.MultiPoint>;
type LineStrings = GeoJSON.FeatureCollection<GeoJSON.LineString>;
type LineString = GeoJSON.Feature<GeoJSON.LineString>;
type MultiLineStrings = GeoJSON.FeatureCollection<GeoJSON.MultiLineString>;
type MultiLineString = GeoJSON.Feature<GeoJSON.MultiLineString>;
type Polygons = GeoJSON.FeatureCollection<GeoJSON.Polygon>;
type Polygon = GeoJSON.Feature<GeoJSON.Polygon>;
type MultiPolygons = GeoJSON.FeatureCollection<GeoJSON.MultiPolygon>;
type MultiPolygon = GeoJSON.Feature<GeoJSON.MultiPolygon>;
type Features = GeoJSON.FeatureCollection<any>;
type Feature = GeoJSON.Feature<any>;

interface FlipStatic {
    /**
     * http://turfjs.org/docs/#flip
     */
    (features: Point): Point;
    (features: Points): Points;
    (features: MultiPoint): MultiPoint;
    (features: MultiPoints): MultiPoints;
    (features: LineString): LineString;
    (features: LineStrings): LineStrings;
    (features: MultiLineString): MultiLineString;
    (features: MultiLineStrings): MultiLineStrings;
    (features: Polygon): Polygon;
    (features: Polygons): Polygons;
    (features: MultiPolygon): MultiPolygon;
    (features: MultiPolygons): MultiPolygons;
    (features: Feature): Feature;
    (features: Features): Features;
}
declare const flip: FlipStatic;
declare namespace flip { }
export = flip;
