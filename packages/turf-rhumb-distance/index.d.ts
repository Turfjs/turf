/// <reference types="geojson" />

type Point = GeoJSON.Feature<GeoJSON.Point>;

/**
 * http://turfjs.org/docs/#rhumb-distance
 */
declare function rhumbDistance(from: Point, to: Point, units?: string): number;
declare namespace rhumbDistance { }
export = rhumbDistance;
