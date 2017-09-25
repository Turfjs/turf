/// <reference types="geojson" />

export type Feature = GeoJSON.Feature<any>;
export type Features = GeoJSON.FeatureCollection<any>;
export type BBox = [number, number, number, number];

/**
 * http://turfjs.org/docs/#bbox
 */
export default function bbox(features: Feature | Features): BBox;
