/// <reference types="geojson" />

import {BBox, LineString, MultiLineString, Polygon, MultiPolygon} from '@turf/helpers'

/**
 * http://turfjs.org/docs/#bboxclip
 */
declare function bboxClip(feature: LineString | MultiLineString, bbox: BBox): LineString | MultiLineString;
declare function bboxClip(feature: Polygon | MultiPolygon, bbox: BBox): Polygon | MultiPolygon;

export default bboxClip;
