/// <reference types="geojson" />

export type Point = GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point | number[];
export type Feature = GeoJSON.Feature<GeoJSON.Point>;

/**
 * http://turfjs.org/docs/#midpoint
 */
export default function midpoint(point1: Point, point2: Point): Feature;