/// <reference types="geojson" />

import {Polygon, Polygons, MultiPolygon} from '@turf/helpers'

/**
 * http://turfjs.org/docs/#difference
 */
declare function difference(poly1: Polygon|MultiPolygon, poly2: Polygon|MultiPolygon): Polygons;
declare namespace difference { }
export = difference;
