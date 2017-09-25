/// <reference types="geojson" />

type Polygon = GeoJSON.Feature<GeoJSON.Polygon>;
type FeatureCollection<T extends GeoJSON.Polygon> = GeoJSON.FeatureCollection<T>;
type Point = GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point | number[];
type LineString = GeoJSON.Feature<GeoJSON.LineString> | GeoJSON.LineString;

/**
 * http://turfjs.org/docs/#shortestpath
 */
declare function shortestPath(start: Point, end: Point, obstacles: FeatureCollection<Polygon>, options?: Object): LineString;
declare namespace shortestPath { }
export = shortestPath;
