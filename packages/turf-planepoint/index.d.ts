/// <reference types="geojson" />

type Point = GeoJSON.Feature<GeoJSON.Point>;
type Polygon = GeoJSON.Feature<GeoJSON.Polygon>;

/**
 * http://turfjs.org/docs/#planepoint
 */
declare function planepoint(point: Point, triangle: Polygon): number;
declare namespace planepoint { }
export = planepoint;
