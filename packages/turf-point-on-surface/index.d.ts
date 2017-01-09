/// <reference types="geojson" />

type Point = GeoJSON.Feature<GeoJSON.Point>;
type Feature = GeoJSON.Feature<any>;
type Features = GeoJSON.FeatureCollection<any>;

/**
 * http://turfjs.org/docs/#pointonsurface
 */
declare function pointOnSurface(features: Feature | Features): Point;
declare namespace pointOnSurface { }
export = pointOnSurface;
