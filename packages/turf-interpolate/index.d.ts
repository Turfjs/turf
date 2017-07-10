/// <reference types="geojson" />

import {Units, Points} from '@turf/helpers';

/**
 * http://turfjs.org/docs/#interpolate
 */
declare function interpolate(
    points: Points,
    cellSize: number,
    property?: string,
    units?: Units,
    weight?: number): Points;

declare namespace interpolate { }
export = interpolate;
