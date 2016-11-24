/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#combine
 */
declare function combine(features: GeoJSON.FeatureCollection<GeoJSON.Point | GeoJSON.LineString | GeoJSON.Polygon>): GeoJSON.FeatureCollection<GeoJSON.MultiPoint | GeoJSON.MultiLineString | GeoJSON.MultiPolygon>;
declare namespace combine { }
export = combine;