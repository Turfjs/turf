/// <reference types="geojson" />

type Polygons = GeoJSON.FeatureCollection<GeoJSON.Polygon>;
type Geoms = GeoJSON.LineString | GeoJSON.MultiLineString;

/**
 * http://turfjs.org/docs/#polygonize
 */
declare function polygonize<Geom extends Geoms>(geojson: GeoJSON.Feature<Geom> | GeoJSON.FeatureCollection<Geom> | Geom): Polygons;
declare namespace polygonize { }
export = polygonize;
