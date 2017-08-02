/// <reference types="geojson" />

type Point = GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point | number[];
type Feature = GeoJSON.Feature<GeoJSON.Point>;

/**
 * http://turfjs.org/docs/#midpoint
 */
declare function midpoint(point1: Point, point2: Point): Feature;
declare namespace midpoint { }
export = midpoint;
