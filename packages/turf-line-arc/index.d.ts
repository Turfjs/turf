/// <reference types="geojson" />

import {Point, LineString, Units} from '@turf/helpers';

/**
 * http://turfjs.org/docs/#linearc
 */
declare function lineArc(center: Point, radius: number, bearing1: number, bearing2: number, steps?: number, units?: string): LineString;
declare namespace lineArc { }
export = lineArc;
