/// <reference types="geojson" />

type Geoms = GeoJSON.Feature<any> | GeoJSON.FeatureCollection<any> | GeoJSON.GeometryObject | GeoJSON.GeometryCollection;

/**
 * http://turfjs.org/docs/#simplify
 */
declare function simplify(geojson: Geoms, tolerance?: number, highQuality?: boolean): Geoms;
declare namespace simplify { }
export = simplify;