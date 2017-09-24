/// <reference types="geojson" />

export type Feature = GeoJSON.Feature<any> | GeoJSON.GeometryObject;

/**
 * http://turfjs.org/docs/#boolean-crosses
 */
export default function booleanCrosses(feature1: Feature, feature2: Feature): boolean;
