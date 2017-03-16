/// <reference types="geojson" />

type Polygon = GeoJSON.Feature<GeoJSON.Polygon>;
type MultiPolygon = GeoJSON.Feature<GeoJSON.MultiPolygon>;

/**
 * http://turfjs.org/docs/#union
 */
declare function union(...features: Polygon[]): Polygon | MultiPolygon;
declare namespace union {}
export = union