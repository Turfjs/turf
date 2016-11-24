/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#envelope
 */
declare function envelope(features: envelope.Features): envelope.Polygon;
declare namespace envelope {
    type Features = GeoJSON.Feature<any> | GeoJSON.FeatureCollection<any>;
    type Polygon = GeoJSON.Feature<GeoJSON.Polygon>;
}
export = envelope;
