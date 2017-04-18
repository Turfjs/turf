/// <reference types="geojson" />

import {BBox, LineString, MultiLineString, Polygon, MultiPolygon} from '@turf/helpers'

interface BBoxClip {
  /**
   * http://turfjs.org/docs/#bboxclip
   */
  (feature: LineString | MultiLineString, bbox: BBox): LineString | MultiLineString
  (feature: Polygon | MultiPolygon, bbox: BBox): Polygon | MultiPolygon
}
declare const bboxClip: BBoxClip;
export = bboxClip;
