/// <reference types="geojson" />

export type Point = GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point | number[];
export type Polygon = GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> | GeoJSON.Polygon | GeoJSON.MultiPolygon;

/**
 * http://turfjs.org/docs/#inside
 */
export default function inside(point: Point, polygon: Polygon, ignoreBoundary?: boolean): boolean;
