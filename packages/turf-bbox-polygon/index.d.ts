/// <reference types="geojson" />

type Polygon = GeoJSON.Feature<GeoJSON.Polygon>;
type BBox = Array<number>;

/**
 * http://turfjs.org/docs/#bboxpolygon
 */
export default function bboxPolygon(bbox: BBox): Polygon;
