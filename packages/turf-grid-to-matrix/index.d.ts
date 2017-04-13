/// <reference types="geojson" />

import {Points} from '@turf/helpers';

/**
 * http://turfjs.org/docs/#gridtomatrix
 */
declare function gridToMatrix(points: Points, property?: string): Array<Array<number>>;
declare namespace gridToMatrix { }
export = gridToMatrix;
