/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#centroid
 */
declare function centroid(features: GeoJSON.Feature<any> | GeoJSON.FeatureCollection<any>): GeoJSON.Feature<GeoJSON.Point>;
declare namespace centroid { }
export = centroid;
