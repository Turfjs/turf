/// <reference types="geojson" />

import {Units} from '@turf/helpers'

type Point = GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point | number[];
type LineString = GeoJSON.LineString;
type MultiLineString = GeoJSON.MultiLineString;
type Line = GeoJSON.Feature<LineString | MultiLineString> | LineString | MultiLineString;

interface PointOnLine extends GeoJSON.Feature<GeoJSON.Point> {
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
declare function pointOnLine(
    line: Line,
    point: Point,
    units?: Units): PointOnLine;

declare namespace pointOnLine { }
export = pointOnLine;
