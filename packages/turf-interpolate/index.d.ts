/// <reference types="geojson" />

import {Points} from '@turf/helpers';

/**
 * http://turfjs.org/docs/#linearc
 */
declare function interpolate(points: Points, cellSize: number, property?: number, units?: string): Points;
declare namespace interpolate { }
export = interpolate;
