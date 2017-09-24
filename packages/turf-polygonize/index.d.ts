/// <reference types="geojson" />

export type Polygons = GeoJSON.FeatureCollection<GeoJSON.Polygon>;
export type Geoms = GeoJSON.LineString | GeoJSON.MultiLineString;

/**
 * http://turfjs.org/docs/#polygonize
 */
export default function polygonize<Geom extends Geoms>(geojson: GeoJSON.Feature<Geom> | GeoJSON.FeatureCollection<Geom> | Geom): Polygons;
