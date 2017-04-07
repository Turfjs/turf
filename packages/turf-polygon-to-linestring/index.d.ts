/// <reference types="geojson" />

type MultiLineString = GeoJSON.Feature<GeoJSON.MultiLineString>;
type LineString = GeoJSON.Feature<GeoJSON.LineString>;
type Polygon = GeoJSON.Feature<GeoJSON.Polygon>;
type MultiPolygon = GeoJSON.Feature<GeoJSON.MultiPolygon>;

/**
 * http://turfjs.org/docs/#polygonToLineString
 */
declare function polygonToLineString(polygon: Polygon | MultiPolygon): LineString | MultiLineString;
declare namespace polygonToLineString { }
export = polygonToLineString;
