/// <reference types="geojson" />

export type Feature = GeoJSON.Feature<any>;
export type FeatureCollection = GeoJSON.FeatureCollection<any>;

/**
 * http://turfjs.org/docs/#area
 */
export default function area(features: Feature | FeatureCollection): number;
