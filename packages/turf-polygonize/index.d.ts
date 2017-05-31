/// <reference types="geojson" />

type Lines = GeoJSON.FeatureCollection<GeoJSON.LineString>;
type Polygons = GeoJSON.FeatureCollection<GeoJSON.Polygon>;

/**
 * http://turfjs.org/docs/#polygonize
 */
declare function polygonize(lines: Lines): Polygons;

declare namespace polygonize { }
export = polygonize;
