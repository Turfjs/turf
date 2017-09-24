/// <reference types="geojson" />

export type Feature = GeoJSON.Feature<any> | GeoJSON.GeometryObject;

/**
 * http://turfjs.org/docs/#boolean-disjoint
 */
export default function booleanDisjoint(feature1: Feature, feature2: Feature): boolean;
