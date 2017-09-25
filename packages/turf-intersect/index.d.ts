/// <reference types="geojson" />

export type Polygon = GeoJSON.Feature<GeoJSON.Polygon>;
export type Feature = GeoJSON.Feature<any>;

/**
 * http://turfjs.org/docs/#intersect
 */
export default function intersect(poly1: Polygon, poly2: Polygon): Feature;
