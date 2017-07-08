/// <reference types="geojson" />

type Point = GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point | number[];
type Polygon = GeoJSON.Feature<GeoJSON.Polygon> | GeoJSON.Polygon;

/**
 * http://turfjs.org/docs/#planepoint
 */
declare function planepoint(point: Point, triangle: Polygon): number;
declare namespace planepoint { }
export = planepoint;
