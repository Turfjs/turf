/// <reference types="geojson" />

type LineString = GeoJSON.LineString
type Polygon = GeoJSON.Polygon
type MultiLineString = GeoJSON.MultiLineString
type MultiPolygon = GeoJSON.MultiPolygon

type Feature = GeoJSON.Feature<LineString | MultiLineString | Polygon | MultiPolygon>
    | LineString | MultiLineString | Polygon | MultiPolygon

/**
 * http://turfjs.org/docs/#boolean-overlaps
 */
declare function overlaps(feature1: Feature, feature2: Feature): boolean;
declare namespace overlaps { }
export = overlaps;
