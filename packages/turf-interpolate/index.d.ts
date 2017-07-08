/// <reference types="geojson" />

import {Points} from '@turf/helpers';

/**
 * http://turfjs.org/docs/#interpolate
 */
declare function interpolate(points: Points, cellSize: number, property?: number, units?: string, weight?:number): Points;
declare namespace interpolate { }
export = interpolate;
