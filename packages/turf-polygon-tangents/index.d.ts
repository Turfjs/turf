/// <reference types="geojson" />

type Point = GeoJSON.Feature<GeoJSON.Point>;
type Polygon = GeoJSON.Feature<GeoJSON.Polygon>;
type Features = GeoJSON.FeatureCollection<Point>;

/**
 * http://turfjs.org/docs/#polygonTangents
 */
declare function polygonTangents(point: Point, polygon: Polygon): Features;
declare namespace polygonTangents { }
export = polygonTangents;
