/// <reference types="geojson" />

import {Point, Polygon, Units} from '@turf/helpers';

/**
 * http://turfjs.org/docs/#sector
 */
declare function sector(center: Point, radius: number, bearing1: number, bearing2: number, steps?: number, units?: Units): Polygon;
declare namespace sector {}
export = sector;
