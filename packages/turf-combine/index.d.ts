/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#combine
 */
declare function combine(features: combine.Features): combine.MultiFeatures;
declare namespace combine {
    type Features = GeoJSON.FeatureCollection<GeoJSON.Point | GeoJSON.LineString | GeoJSON.Polygon>;
    type MultiFeatures = GeoJSON.FeatureCollection<GeoJSON.MultiPoint | GeoJSON.MultiLineString | GeoJSON.MultiPolygon>;
}
export = combine;