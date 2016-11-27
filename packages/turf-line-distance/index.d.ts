/// <reference types="geojson" />

type LineStrings = GeoJSON.FeatureCollection<GeoJSON.LineString>;
type LineString = GeoJSON.Feature<GeoJSON.LineString>;
type MultiLineStrings = GeoJSON.FeatureCollection<GeoJSON.MultiLineString>;
type MultiLineString = GeoJSON.Feature<GeoJSON.MultiLineString>;
type Polygons = GeoJSON.FeatureCollection<GeoJSON.Polygon>;
type Polygon = GeoJSON.Feature<GeoJSON.Polygon>;
type MultiPolygons = GeoJSON.FeatureCollection<GeoJSON.MultiPolygon>;
type MultiPolygon = GeoJSON.Feature<GeoJSON.MultiPolygon>;
type LineStringFeatures = LineString | LineStrings | MultiLineString | MultiLineStrings | GeoJSON.LineString | GeoJSON.MultiLineString
type PolygonFeatures = Polygon | Polygons | MultiPolygon | MultiPolygons | GeoJSON.Polygon | GeoJSON.MultiPolygon

/**
 * http://turfjs.org/docs/#linedistance
 */
declare function lineDistance(features: LineStringFeatures | PolygonFeatures, units?: string): number;
declare namespace lineDistance { }
export = lineDistance;
