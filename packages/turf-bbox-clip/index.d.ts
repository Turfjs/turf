/// <reference types="geojson" />

import {
    BBox,
    LineString,
    MultiLineString,
    Polygon,
    MultiPolygon,
    Feature
} from '@turf/helpers'

/**
 * http://turfjs.org/docs/#bboxclip
 */
declare function bboxClip(feature: Feature<LineString | MultiLineString> | LineString | MultiLineString, bbox: BBox): Feature<LineString | MultiLineString>;
declare function bboxClip(feature: Feature<Polygon | MultiPolygon> | Polygon | MultiPolygon, bbox: BBox): Feature<Polygon | MultiPolygon>;

export default bboxClip;
