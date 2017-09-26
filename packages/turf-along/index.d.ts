/// <reference types="geojson" />

import { Units } from '@turf/helpers';
export type LineString = GeoJSON.Feature<GeoJSON.LineString>;
export type Point = GeoJSON.Feature<GeoJSON.Point>;

interface Options {
    units?: Units;
}

/**
 * http://turfjs.org/docs/#along
 */
export default function along(line: LineString, distance: number, options?: Options): Point;
