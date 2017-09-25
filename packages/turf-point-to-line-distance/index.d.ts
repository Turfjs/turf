/// <reference types="geojson" />

import {Units} from '@turf/helpers'

export { Units }
export type Point = GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point | number[];
export type LineString = GeoJSON.Feature<GeoJSON.LineString> | GeoJSON.LineString;

/**
 * http://turfjs.org/docs/#pointto-line-distance
 */
export default function pointToLineDistance(
    point: Point,
    line: LineString,
    units?: Units,
    mercator?: boolean): number;
