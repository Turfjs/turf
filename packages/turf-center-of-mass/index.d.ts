/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#center
 */
declare function centerOfMass(features: GeoJSON.Feature<any> | GeoJSON.FeatureCollection<any>): GeoJSON.Feature<GeoJSON.Point>;
declare namespace centerOfMass { }
export = centerOfMass;
