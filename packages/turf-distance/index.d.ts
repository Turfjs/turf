/// <reference types="geojson" />

import {Units} from '@turf/helpers'

export type Point = GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point | number[];

/**
 * http://turfjs.org/docs/#distance
 */
export default function distance(from: Point, to: Point, units?: Units): number;
