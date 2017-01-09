/// <reference types="geojson" />

type Point = GeoJSON.Feature<GeoJSON.Point>;

/**
 * http://turfjs.org/docs/#midpoint
 */
declare function midpoint(from: Point, to: Point): Point;
declare namespace midpoint { }
export = midpoint;
