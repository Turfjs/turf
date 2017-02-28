/// <reference types="geojson" />

type Polygon = GeoJSON.Feature<GeoJSON.Polygon>;
type MultiPolygon = GeoJSON.Feature<GeoJSON.MultiPolygon>;

/**
 * http://turfjs.org/docs/#difference
 */
declare function difference(poly1: Polygon, poly2: Polygon): Polygon|MultiPolygon;
declare namespace difference { }
export = difference;
