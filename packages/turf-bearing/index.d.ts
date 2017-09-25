/// <reference types="geojson" />

export type Point = GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point | number[];

interface Options {
    final?: boolean
}

/**
 * http://turfjs.org/docs/#bearing
 */
export default function bearing(start: Point, end: Point, options?: Options): number;
