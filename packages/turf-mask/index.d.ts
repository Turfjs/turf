/// <reference types="geojson" />

type Geom = GeoJSON.Polygon | GeoJSON.MultiPolygon;
type Poly = GeoJSON.FeatureCollection<Geom> | GeoJSON.Feature<Geom> | Geom;
type Polygon = GeoJSON.Feature<GeoJSON.Polygon>;
type Mask = GeoJSON.Feature<GeoJSON.Polygon> | GeoJSON.Polygon;

/**
 * http://turfjs.org/docs/#mask
 */
declare function mask(poly: Poly, mask?: Mask): Polygon;
declare namespace mask {}
export = mask;
