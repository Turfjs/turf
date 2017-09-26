/// <reference types="geojson" />

import { Units } from '@turf/helpers'

export { Units }
export type Point = GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point | number[];
export type LineString = GeoJSON.LineString;
export type MultiLineString = GeoJSON.MultiLineString;
export type Line = GeoJSON.Feature<LineString | MultiLineString> | LineString | MultiLineString;
export interface PointOnLine extends GeoJSON.Feature<GeoJSON.Point> {
    properties: {
        index?: number
        dist?: number
        location?: number
        [key: string]: any
    }
}

/**
 * http://turfjs.org/docs/#pointonline
 */
export default function pointOnLine(
    line: Line,
    point: Point,
    units?: Units): PointOnLine;
