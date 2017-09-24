/// <reference types="geojson" />

export type Polygon = GeoJSON.Feature<GeoJSON.Polygon>;
export type BBox = [number, number, number, number];

/**
 * http://turfjs.org/docs/#bboxpolygon
 */
export default function bboxPolygon(bbox: BBox): Polygon;
