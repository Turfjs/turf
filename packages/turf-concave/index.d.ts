/// <reference types="geojson" />

import {Units} from '@turf/helpers'

export type Points = GeoJSON.FeatureCollection<GeoJSON.Point>;
export type Polygon = GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>;

/**
 * http://turfjs.org/docs/#concave
 */
export default function concave(points: Points, maxEdge: number, units?: Units): Polygon;
