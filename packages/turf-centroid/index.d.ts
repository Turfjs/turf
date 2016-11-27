/// <reference types="geojson" />

type Feature = GeoJSON.Feature<any>;
type Features = GeoJSON.FeatureCollection<any>;
type Point = GeoJSON.Feature<GeoJSON.Point>;

/**
 * http://turfjs.org/docs/#centroid
 */
declare function centroid(features: Feature | Features): Point;
declare namespace centroid { }
export = centroid;
