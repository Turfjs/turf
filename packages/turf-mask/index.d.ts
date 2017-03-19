/// <reference types="geojson" />

type Polygon = GeoJSON.Feature<GeoJSON.Polygon> | GeoJSON.Polygon;

/**
 * http://turfjs.org/docs/#mask
 */
declare function mask(poly: Polygon, mask?: Polygon): Polygon;
declare namespace mask {}
export = mask;
