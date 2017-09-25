/// <reference types="geojson" />

export type Point = GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point | number[];
export type Polygon = GeoJSON.Feature<GeoJSON.Polygon> | GeoJSON.Polygon;

/**
 * http://turfjs.org/docs/#planepoint
 */
export default function planepoint(point: Point, triangle: Polygon): number;
