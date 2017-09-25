/// <reference types="geojson" />

export type Feature = GeoJSON.Feature<any>;
export type Features = GeoJSON.FeatureCollection<any>;
export type Polygon = GeoJSON.Feature<GeoJSON.Polygon>;

/**
 * http://turfjs.org/docs/#envelope
 */
export default function envelope(features: Feature | Features): Polygon;
