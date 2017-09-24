/// <reference types="geojson" />

export type Feature = GeoJSON.Feature<any>;
export type Features = GeoJSON.FeatureCollection<any>;
export type Point = GeoJSON.Feature<GeoJSON.Point>;

/**
 * http://turfjs.org/docs/#center
 */
export default function (features: Feature | Features, properties?: any): Point;
