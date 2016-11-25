/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#linedistance
 */
declare function lineDistance(
    features: lineDistance.Features,
    units?: string): lineDistance.Points;
declare namespace lineDistance {
    type Features = LineStrings | Polygons;
    type Points = GeoJSON.FeatureCollection<GeoJSON.Point>;
    type LineString = GeoJSON.FeatureCollection<GeoJSON.LineString> | GeoJSON.Feature<GeoJSON.LineString> | GeoJSON.LineString;
    type MultiLineString = GeoJSON.FeatureCollection<GeoJSON.MultiLineString> | GeoJSON.Feature<GeoJSON.MultiLineString> | GeoJSON.MultiLineString;
    type LineStrings = LineString | MultiLineString;
    type Polygon = GeoJSON.FeatureCollection<GeoJSON.Polygon> | GeoJSON.FeatureCollection<GeoJSON.Polygon> | GeoJSON.Polygon;
    type MultiPolygon = GeoJSON.FeatureCollection<GeoJSON.MultiPolygon> | GeoJSON.FeatureCollection<GeoJSON.MultiPolygon> | GeoJSON.MultiPolygon;
    type Polygons = Polygon | MultiPolygon;
    type Units = "miles" | "nauticalmiles" | "degrees" | "radians" | "inches" | "yards" | "meters" | "metres" | "kilometers" | "kilometres";
}
export = lineDistance;
