/// <reference types="geojson" />

type Point = GeoJSON.Feature<GeoJSON.Point>;
type Polygon = GeoJSON.Feature<GeoJSON.Polygon>;
type MultiPolygon = GeoJSON.Feature<GeoJSON.MultiPolygon>;

/**
 * http://turfjs.org/docs/#inside
 */
declare function inside(point: Point, polygon: Polygon | MultiPolygon): boolean;
declare namespace inside { }
export = inside;
