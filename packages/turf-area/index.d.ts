/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#area
 */
declare function area(features: GeoJSON.Feature<any> | GeoJSON.FeatureCollection<any>): number;
declare namespace area { }
export = area;
