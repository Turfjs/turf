/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#bboxpolygon
 */
declare function bboxPolygon(bbox: Array<number>): GeoJSON.Feature<GeoJSON.Polygon>;
declare namespace bboxPolygon { }
export = bboxPolygon;
