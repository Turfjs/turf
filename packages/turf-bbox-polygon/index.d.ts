/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#bboxpolygon
 */
declare function bboxPolygon(bbox: bboxPolygon.BBox): bboxPolygon.Polygon;
declare namespace bboxPolygon {
    type Polygon = GeoJSON.Feature<GeoJSON.Polygon>;
    type BBox = Array<number>;
}
export = bboxPolygon;
