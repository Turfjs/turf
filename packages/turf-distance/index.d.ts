/// <reference types="geojson" />

type Point = GeoJSON.Feature<GeoJSON.Point>;

/**
 * http://turfjs.org/docs/#distance
 */
declare function distance(from: Point, to: Point, units?: string): number;
declare namespace distance { }
export = distance;
