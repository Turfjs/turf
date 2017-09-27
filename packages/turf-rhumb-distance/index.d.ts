/// <reference types="geojson" />

import { Units } from '@turf/helpers';

export { Units }
export type Point = GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point | number[];
interface Options {
    units?: Units;
}

/**
 * http://turfjs.org/docs/#rhumb-distance
 */
export default function rhumbDistance(from: Point, to: Point, options?: Options): number;
