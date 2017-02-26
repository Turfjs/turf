/// <reference types="geojson" />

import {Polygon, LineString, Polygons} from '@turf/helpers';

/**
 * http://turfjs.org/docs/#slice
 */
declare function slice(poly: Polygon, line: LineString): Polygons;
declare namespace slice { }
export = slice;
