/// <reference types="geojson" />

export type Point = GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point | number[];

interface Options {
    final?: boolean;
}

/**
 * http://turfjs.org/docs/#rhumb-bearing
 */
export default function rhumbBearing(start: Point, end: Point, options?: Options): number;
