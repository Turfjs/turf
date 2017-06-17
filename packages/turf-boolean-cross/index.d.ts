/// <reference types="geojson" />

type Feature = GeoJSON.Feature<any> | GeoJSON.GeometryObject;

/**
 * http://turfjs.org/docs/#boolean-cross
 */
declare function cross(feature1: Feature, feature2: Feature): boolean;
declare namespace cross { }
export = cross;
