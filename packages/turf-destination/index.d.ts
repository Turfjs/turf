/// <reference types="geojson" />

type Point = GeoJSON.Feature<GeoJSON.Point>;

/**
 * http://turfjs.org/docs/#destination
 */
declare function destination(from: Point, distance: number, bearing: number, units?: string): Point;
declare namespace destination { }
export = destination;
