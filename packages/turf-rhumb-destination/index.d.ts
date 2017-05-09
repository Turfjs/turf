/// <reference types="geojson" />

type Point = GeoJSON.Feature<GeoJSON.Point>;

/**
 * http://turfjs.org/docs/#rhumb-destination
 */
declare function rhumbDestination(from: Point, distance: number, bearing: number, units?: string): Point;
declare namespace rhumbDestination { }
export = rhumbDestination;
