/// <reference types="geojson" />

import {Units} from '@turf/helpers'

export type Points = GeoJSON.FeatureCollection<GeoJSON.Point>;
export type Polygons = GeoJSON.FeatureCollection<GeoJSON.Polygon>;

/**
 * http://turfjs.org/docs/#idw
 */
export default function idw(controlPoints: Points, valueField: string, weight: number, cellWidth: number, units?: Units): Polygons;
