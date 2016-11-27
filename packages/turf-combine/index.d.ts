/// <reference types="geojson" />

type Points = GeoJSON.FeatureCollection<GeoJSON.Point>;
type LineStrings = GeoJSON.FeatureCollection<GeoJSON.LineString>;
type Polygons = GeoJSON.FeatureCollection<GeoJSON.Polygon>;
type MultiPoints = GeoJSON.FeatureCollection<GeoJSON.MultiPoint>;
type MultiLineStrings = GeoJSON.FeatureCollection<GeoJSON.MultiLineString>;
type MultiPolygons = GeoJSON.FeatureCollection<GeoJSON.MultiPolygon>;
type Features = GeoJSON.FeatureCollection<any>;

/**
 * http://turfjs.org/docs/#combine
 */
declare function combine(features: Points): MultiPoints;

/**
 * http://turfjs.org/docs/#combine
 */
declare function combine(features: LineStrings): MultiLineStrings;

/**
 * http://turfjs.org/docs/#combine
 */
declare function combine(features: Polygons): MultiPolygons;

/**
 * http://turfjs.org/docs/#combine
 */
declare function combine(features: Features): Features;
declare namespace combine { }
export = combine;