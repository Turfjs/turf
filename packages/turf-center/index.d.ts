/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#center
 */
declare function center(features: GeoJSON.Feature<any> | GeoJSON.FeatureCollection<any>): GeoJSON.Feature<GeoJSON.Point>;
declare namespace center { }
export = center;
