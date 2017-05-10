/// <reference types="geojson" />

type Point = GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point | number[];

/**
 * http://turfjs.org/docs/#bearing
 */
declare function bearing(start: Point, end: Point, final?: boolean): number;
declare namespace bearing { }
export = bearing;
