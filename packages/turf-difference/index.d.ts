/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#difference
 */
declare function difference(poly1: GeoJSON.Feature<GeoJSON.Polygon>, poly2: GeoJSON.Feature<GeoJSON.Polygon>): GeoJSON.Feature<GeoJSON.Polygon>;
declare namespace difference { }
export = difference;
