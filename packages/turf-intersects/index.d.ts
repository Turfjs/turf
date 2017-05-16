/// <reference types="geojson" />

type Polygon = GeoJSON.Feature<GeoJSON.Polygon>;
type Feature = GeoJSON.Feature<any>;

/**
 * http://turfjs.org/docs/#intersects
 */
declare function intersects(poly1: Polygon, poly2: Polygon): Boolean;
declare namespace intersects { }
export = intersects;
