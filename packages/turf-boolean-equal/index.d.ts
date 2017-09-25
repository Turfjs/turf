/// <reference types="geojson" />

export type Feature = GeoJSON.Feature<any> | GeoJSON.GeometryObject

/**
 * http://turfjs.org/docs/#boolean-equal
 */
export default function (feature1: Feature, feature2: Feature): boolean;
