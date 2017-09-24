/// <reference types="geojson" />

type Feature = GeoJSON.Feature<any>;
type Features = GeoJSON.FeatureCollection<any>;
type BBox = [number, number, number, number];

/**
 * http://turfjs.org/docs/#bbox
 */
export default function bbox(features: Feature | Features): BBox;
