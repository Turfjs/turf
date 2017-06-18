/// <reference types="geojson" />

type Feature = GeoJSON.Feature<any> | GeoJSON.GeometryObject;

/**
 * http://turfjs.org/docs/#boolean-disjoint
 */
declare function disjoint(feature1: Feature, feature2: Feature): boolean;
declare namespace disjoint { }
export = disjoint;
