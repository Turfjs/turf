/// <reference types="geojson" />

import { Units } from '@turf/helpers';

export { Units }
export type Point = GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point | number[];
interface Options {
    units?: Units;
}

/**
 * http://turfjs.org/docs/#rhumb-destination
 */
export default function rhumbDestination(origin: Point, distance: number, bearing: number, options?: Options): GeoJSON.Feature<GeoJSON.Point>;
