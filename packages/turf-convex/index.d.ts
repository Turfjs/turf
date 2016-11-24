/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#convex
 */
declare function convex(features: GeoJSON.Feature<any> | GeoJSON.FeatureCollection<any>): GeoJSON.Feature<GeoJSON.Polygon>;
declare namespace convex { }
export = convex;
