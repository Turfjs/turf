/// <reference types="geojson" />

type Point = GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point | number[];
type Polygon = GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> | GeoJSON.Polygon | GeoJSON.MultiPolygon;

/**
 * http://turfjs.org/docs/#inside
 */
declare function inside(point: Point, polygon: Polygon, ignoreBoundary?: boolean): boolean;
declare namespace inside { }
export = inside;
