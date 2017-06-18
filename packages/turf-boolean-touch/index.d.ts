/// <reference types="geojson" />

type Feature = GeoJSON.Feature<any> | GeoJSON.GeometryObject;

/**
 * http://turfjs.org/docs/#boolean-touch
 */
declare function touch(feature1: Feature, feature2: Feature): boolean;
declare namespace touch { }
export = touch;
