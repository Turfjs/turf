/// <reference types="geojson" />

import { Units } from '@turf/helpers'

type Points = GeoJSON.FeatureCollection<GeoJSON.Point>;
type LineString = GeoJSON.Feature<GeoJSON.LineString> | GeoJSON.LineString;
interface Point extends GeoJSON.Feature<GeoJSON.Point> {
  properties: {
    dist: number
    [key: string]: any
  }
}

/**
 * http://turfjs.org/docs/#nearestpointtoline
 */
declare function nearestPointToLine(points: Points, line: LineString, units?: Units): Point;
declare namespace nearestPointToLine { }
export = nearestPointToLine;
