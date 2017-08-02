/// <reference types="geojson" />

type Feature = GeoJSON.Feature<any> | GeoJSON.GeometryObject

/**
 * http://turfjs.org/docs/#boolean-equal
 */
declare function equal(feature1: Feature, feature2: Feature): boolean;
declare namespace equal {}
export = equal;
