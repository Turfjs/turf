/// <reference types="geojson" />

export type Point = GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point | number[];
export type Polygon = GeoJSON.Feature<GeoJSON.Polygon>;

/**
 * http://turfjs.org/docs/#circle
 */
export default function (center: Point, radius: number, steps?: number, units?: string, properties?: any): Polygon;
