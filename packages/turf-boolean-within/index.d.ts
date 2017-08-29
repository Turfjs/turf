/// <reference types="geojson" />

type Feature = GeoJSON.Feature<any> | GeoJSON.GeometryObject

/**
 * http://turfjs.org/docs/#boolean-within
 */
declare function within(feature1: Feature, feature2: Feature): boolean;
declare namespace within { }
export = within;
