/// <reference types="geojson" />

type Feature = GeoJSON.Feature<any> | GeoJSON.GeometryObject

/**
 * http://turfjs.org/docs/#boolean-overlap
 */
declare function overlap(feature1: Feature, feature2: Feature): boolean;
declare namespace overlap { }
export = overlap;
