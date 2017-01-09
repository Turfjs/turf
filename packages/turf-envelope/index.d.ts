/// <reference types="geojson" />

type Feature = GeoJSON.Feature<any>;
type Features = GeoJSON.FeatureCollection<any>;
type Polygon = GeoJSON.Feature<GeoJSON.Polygon>;

/**
 * http://turfjs.org/docs/#envelope
 */
declare function envelope(features: Feature | Features): Polygon;
declare namespace envelope { }
export = envelope;
