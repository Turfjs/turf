/// <reference types="geojson" />

type Geometry = GeoJSON.Polygon | GeoJSON.LineString | GeoJSON.MultiLineString | GeoJSON.MultiPolygon
type Feature = GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.LineString | GeoJSON.MultiLineString | GeoJSON.MultiPolygon>
type Features = GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.LineString | GeoJSON.MultiLineString | GeoJSON.MultiPolygon>

/**
 * http://turfjs.org/docs/#linedistance
 */
declare function lineDistance(features: Geometry | Feature | Features, units?: string): number;
declare namespace lineDistance { }
export = lineDistance;
