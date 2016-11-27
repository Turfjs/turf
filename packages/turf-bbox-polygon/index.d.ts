/// <reference types="geojson" />

type Polygon = GeoJSON.Feature<GeoJSON.Polygon>;
type BBox = Array<number>;

/**
 * http://turfjs.org/docs/#bboxpolygon
 */
declare function bboxPolygon(bbox: BBox): Polygon;
declare namespace bboxPolygon { }
export = bboxPolygon;
