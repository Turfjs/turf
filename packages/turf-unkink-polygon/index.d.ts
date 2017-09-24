/// <reference types="geojson" />

import { Polygon, Polygons, MultiPolygon, MultiPolygons } from '@turf/helpers';

/**
 * http://turfjs.org/docs/#unkink-polygon
 */
export default function unkinkPolygon(geojson: Polygon | Polygons | MultiPolygon | MultiPolygons): Polygons;
