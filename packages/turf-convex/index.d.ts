/// <reference types="geojson" />

type Feature = GeoJSON.Feature<any>;
type Features = GeoJSON.FeatureCollection<any>;
type Polygon = GeoJSON.Feature<GeoJSON.Polygon>;

/**
 * http://turfjs.org/docs/#convex
 */
declare function convex(features: Feature | Features): Polygon;
declare namespace convex { }
export = convex;
