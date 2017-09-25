/// <reference types="geojson" />

export type Geom = GeoJSON.Polygon | GeoJSON.MultiPolygon;
export type Poly = GeoJSON.FeatureCollection<Geom> | GeoJSON.Feature<Geom> | Geom;
export type Polygon = GeoJSON.Feature<GeoJSON.Polygon>;
export type Mask = GeoJSON.Feature<GeoJSON.Polygon> | GeoJSON.Polygon;

/**
 * http://turfjs.org/docs/#mask
 */
export default function mask(poly: Poly, mask?: Mask): Polygon;
