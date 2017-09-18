/// <reference types="geojson" />

import { Units, FeatureGeometryCollection } from '@turf/helpers'

type Points = GeoJSON.FeatureCollection<GeoJSON.Point> | FeatureGeometryCollection;
type LineString = GeoJSON.Feature<GeoJSON.LineString> | GeoJSON.LineString;
interface Point extends GeoJSON.Feature<GeoJSON.Point> {
  properties: {
    dist: number
    [key: string]: any
  }
}
interface Options {
  /**
   * unit of the output distance property, can be degrees, radians, miles, or kilometer
   */
  units?: Units
}
/**
 * http://turfjs.org/docs/#nearestpointtoline
 */
declare function nearestPointToLine(points: Points, line: LineString, options?: Options): Point;
declare namespace nearestPointToLine { }
export = nearestPointToLine;
