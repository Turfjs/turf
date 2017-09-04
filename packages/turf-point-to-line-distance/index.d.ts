/// <reference types="geojson" />

import {Units} from '@turf/helpers'

type Point = GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point | number[];
type LineString = GeoJSON.LineString;

/**
 * http://turfjs.org/docs/#pointto-line-distance
 */
declare function pointToLineDistance(
    point: Point,
    line: LineString,
    units?: Units,
    mercator?: boolean): number;

declare namespace pointToLineDistance { }
export = pointToLineDistance;
