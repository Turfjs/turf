/// <reference types="geojson" />

type Point = GeoJSON.Feature<GeoJSON.Point>;

/**
 * http://turfjs.org/docs/#rhumb-bearing
 */
declare function rhumbBearing(start: Point, end: Point): number;
declare namespace rhumbBearing { }
export = rhumbBearing;
