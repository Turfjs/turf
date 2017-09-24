/// <reference types="geojson" />

export type Polygon = GeoJSON.Feature<GeoJSON.Polygon> | GeoJSON.Polygon;
export type MultiPolygon = GeoJSON.Feature<GeoJSON.MultiPolygon> | GeoJSON.MultiPolygon;
export type Feature = GeoJSON.Feature<GeoJSON.LineString | GeoJSON.MultiLineString>;
export type FeatureCollection = GeoJSON.FeatureCollection<GeoJSON.LineString | GeoJSON.MultiLineString>;

/**
 * http://turfjs.org/docs/#polygontolinestring
 */
declare function polygonToLineString(polygon: Polygon): Feature;
declare function polygonToLineString(polygon: MultiPolygon): FeatureCollection;

export default polygonToLineString;
