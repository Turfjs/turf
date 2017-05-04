/// <reference types="geojson" />

type Point = GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point;
type Polygon = GeoJSON.Feature<GeoJSON.Polygon> | GeoJSON.Polygon;
type FeatureCollection = GeoJSON.FeatureCollection<Point>;

/**
 * http://turfjs.org/docs/#polygonTangents
 */
declare function polygonTangents(point: Point, polygon: Polygon): FeatureCollection;
declare namespace polygonTangents { }
export = polygonTangents;
