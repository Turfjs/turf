/// <reference types="geojson" />

export type Polygon = GeoJSON.Feature<GeoJSON.Polygon>;
export type MultiPolygon = GeoJSON.Feature<GeoJSON.MultiPolygon>;

/**
 * http://turfjs.org/docs/#union
 */
export default function union(...features: Polygon[]): Polygon | MultiPolygon;
