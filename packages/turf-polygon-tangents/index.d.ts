/// <reference types="geojson" />

export type Point = GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point;
export type Polygon = GeoJSON.Feature<GeoJSON.Polygon> | GeoJSON.Polygon;
export type MultiPolygon = GeoJSON.Feature<GeoJSON.MultiPolygon> | GeoJSON.MultiPolygon;
export type FeatureCollection = GeoJSON.FeatureCollection<GeoJSON.Point>;

/**
 * http://turfjs.org/docs/#polygonTangents
 */
export default function polygonTangents(point: Point, polygon: Polygon | MultiPolygon): FeatureCollection;
