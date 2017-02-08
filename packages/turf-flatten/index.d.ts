/// <reference types="geojson" />

type Feature = GeoJSON.Feature<any>;
type Features = GeoJSON.FeatureCollection<any>;

/**
 * http://turfjs.org/docs.html#flatten
 */
declare function flatten(features: Feature | Features);
declare namespace flatten { }
export = flatten;
