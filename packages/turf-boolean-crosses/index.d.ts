/// <reference types="geojson" />

type Feature = GeoJSON.Feature<any> | GeoJSON.GeometryObject;

/**
 * http://turfjs.org/docs/#boolean-crosses
 */
declare function booleanCrosses(feature1: Feature, feature2: Feature): boolean;
declare namespace booleanCrosses { }
export = booleanCrosses;
