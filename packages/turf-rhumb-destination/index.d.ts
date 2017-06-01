/// <reference types="geojson" />

import {Units} from '@turf/helpers';

type Point = GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point | number[];

/**
 * http://turfjs.org/docs/#rhumb-destination
 */
declare function rhumbDestination(origin: Point, distance: number, bearing: number, units?: Units): GeoJSON.Feature<GeoJSON.Point>;
declare namespace rhumbDestination { }
export = rhumbDestination;
