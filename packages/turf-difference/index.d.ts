/// <reference types="geojson" />

type Polygon = GeoJSON.Feature<GeoJSON.Polygon>;

/**
 * http://turfjs.org/docs/#difference
 */
declare function difference(poly1: Polygon, poly2: Polygon): Polygon;
declare namespace difference { }
export = difference;
