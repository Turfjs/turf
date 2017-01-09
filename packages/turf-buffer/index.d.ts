/// <reference types="geojson" />

type Feature = GeoJSON.Feature<any>;
type Features = GeoJSON.FeatureCollection<any>;
type LineString = GeoJSON.Feature<GeoJSON.LineString>;

/**
 * http://turfjs.org/docs/#buffer
 */
declare function buffer(features: Feature | Features, radius?: number, unit?: string): LineString;
declare namespace buffer { }
export = buffer;
