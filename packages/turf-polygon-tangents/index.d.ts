/// <reference types="geojson" />

type Point = GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point;
type Polygon = GeoJSON.Feature<GeoJSON.Polygon> | GeoJSON.Polygon;
type MultiPolygon = GeoJSON.Feature<GeoJSON.MultiPolygon> | GeoJSON.MultiPolygon;
type FeatureCollection = GeoJSON.FeatureCollection<GeoJSON.Point>;

/**
 * http://turfjs.org/docs/#polygonTangents
 */
declare function polygonTangents(point: Point, polygon: Polygon | MultiPolygon): FeatureCollection;
declare namespace polygonTangents { }
export = polygonTangents;
