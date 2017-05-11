/// <reference types="geojson" />

type Point = GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point | number[];

/**
 * http://turfjs.org/docs/#rhumb-bearing
 */
declare function rhumbBearing(start: Point, end: Point, final?: boolean): number;
declare namespace rhumbBearing { }
export = rhumbBearing;
