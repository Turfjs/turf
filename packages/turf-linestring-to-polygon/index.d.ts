/// <reference types="geojson" />

import {
  Polygon,
  Polygons,
  LineString,
  LineStrings,
  MultiLineString,
  MultiLineStrings} from '@turf/helpers'

interface LineStringToPolygon {
  (lines: LineString | MultiLineString): Polygon
  (lines: LineStrings | MultiLineStrings): Polygons
}
declare const lineStringToPolygon: LineStringToPolygon;
export = lineStringToPolygon;
