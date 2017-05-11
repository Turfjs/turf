/// <reference types="geojson" />

import {Units} from '@turf/helpers'

type Point = GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point | number[];

/**
 * http://turfjs.org/docs/#distance
 */
declare function distance(from: Point, to: Point, units?: Units): number;
declare namespace distance { }
export = distance;
