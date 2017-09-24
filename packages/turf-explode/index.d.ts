/// <reference types="geojson" />

export type Feature = GeoJSON.Feature<any>;
export type Features = GeoJSON.FeatureCollection<any>;
export type Points = GeoJSON.FeatureCollection<GeoJSON.Point>;

/**
 * http://turfjs.org/docs/#explode
 */
export default function explode(features: Feature | Features): Points;
