/// <reference types="geojson" />

type Feature = GeoJSON.Feature<any>;
type Features = GeoJSON.FeatureCollection<any>;

/**
 * http://turfjs.org/docs/#area
 */
export default function area(features: Feature | Features): number;
