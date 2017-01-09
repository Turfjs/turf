/// <reference types="geojson" />

type Polygon = GeoJSON.Feature<GeoJSON.Polygon>;
type Feature = GeoJSON.Feature<any>;

/**
 * http://turfjs.org/docs/#intersect
 */
declare function intersect(poly1: Polygon, poly2: Polygon): Feature;
declare namespace intersect { }
export = intersect;
