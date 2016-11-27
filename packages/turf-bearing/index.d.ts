/// <reference types="geojson" />

type Point = GeoJSON.Feature<GeoJSON.Point>;

/**
 * http://turfjs.org/docs/#bearing
 */
declare function bearing(start: Point, end: Point): number;
declare namespace bearing { }
export = bearing;
