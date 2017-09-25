/// <reference types="geojson" />

export type Point = GeoJSON.Feature<GeoJSON.Point>;
export type Feature = GeoJSON.Feature<any>;
export type Features = GeoJSON.FeatureCollection<any>;

/**
 * http://turfjs.org/docs/#pointonsurface
 */
export default function pointOnSurface(features: Feature | Features): Point;
