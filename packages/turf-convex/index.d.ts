/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#convex
 */
declare function convex(features: convex.Features): convex.Polygon;
declare namespace convex {
    type Features = GeoJSON.Feature<any> | GeoJSON.FeatureCollection<any>;
    type Polygon = GeoJSON.Feature<GeoJSON.Polygon>;
}
export = convex;
