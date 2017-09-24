/// <reference types="geojson" />

import { Units, FeatureGeometryCollection } from '@turf/helpers'

export type Points = GeoJSON.FeatureCollection<GeoJSON.Point> | FeatureGeometryCollection;
export type LineString = GeoJSON.Feature<GeoJSON.LineString> | GeoJSON.LineString;
export interface Point extends GeoJSON.Feature<GeoJSON.Point> {
  properties: {
    dist: number
    [key: string]: any
  }
}

/**
 * http://turfjs.org/docs/#nearestpointtoline
 */
export default function nearestPointToLine(points: Points, line: LineString, units?: Units): Point;
