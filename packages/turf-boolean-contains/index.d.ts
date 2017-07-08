/// <reference types="geojson" />

type Feature = GeoJSON.Feature<any> | GeoJSON.GeometryObject;

/**
 * http://turfjs.org/docs/#boolean-contains
 */
declare function booleanContains(feature1: Feature, feature2: Feature): boolean;
declare namespace booleanContains { }
export = booleanContains;
