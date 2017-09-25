/// <reference types="geojson" />

import {Units} from '@turf/helpers'

export type Point = GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point | number[];

/**
 * http://turfjs.org/docs/#destination
 */
export default function destination(origin: Point, distance: number, bearing: number, units?: Units): GeoJSON.Feature<GeoJSON.Point>;
