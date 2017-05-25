/// <reference types="geojson" />

type Geoms = GeoJSON.Feature<any> | GeoJSON.FeatureCollection<any> | GeoJSON.GeometryObject | GeoJSON.GeometryCollection;

/**
 * http://turfjs.org/docs/#truncate
 */
declare function truncate<Geom extends Geoms>(
    geojson: Geom,
    precision?: number,
    coordinates?: number,
    mutate?: boolean): Geom;

declare namespace truncate { }
export = truncate;
