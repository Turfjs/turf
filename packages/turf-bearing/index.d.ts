/// <reference types="geojson" />

export type Point = GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point | number[];

/**
 * http://turfjs.org/docs/#bearing
 */
export default function bearing(start: Point, end: Point, final?: boolean): number;
