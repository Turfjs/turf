/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#bbox
 */
declare function bbox(geojson: GeoJSON.Feature<any> | GeoJSON.FeatureCollection<any>): Array<number>;
declare namespace bbox { }
export = bbox;
