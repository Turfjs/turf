/// <reference types="geojson" />

type Feature = GeoJSON.Feature<any>;
type Features = GeoJSON.FeatureCollection<any>;
type Point = GeoJSON.Feature<GeoJSON.Point>;

/**
 * http://turfjs.org/docs/#center
 */
declare function center(features: Feature | Features): Point;
declare namespace center { }
export = center;
