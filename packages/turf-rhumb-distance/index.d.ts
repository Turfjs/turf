/// <reference types="geojson" />

import {Units} from '@turf/helpers';

type Point = GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point | number[];

/**
 * http://turfjs.org/docs/#rhumb-distance
 */
declare function rhumbDistance(from: Point, to: Point, units?: Units): number;
declare namespace rhumbDistance { }
export = rhumbDistance;
