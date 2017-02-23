/// <reference types="geojson" />

import {Polygon, Polygons, MultiPolygon, MultiPolygons} from '@turf/helpers';

/**
 * http://turfjs.org/docs/#unkink-polygon
 */
declare function unkinkPolygon(geojson: Polygon | Polygons | MultiPolygon | MultiPolygons): Polygons;
declare namespace unkinkPolygon { }
export = unkinkPolygon;
