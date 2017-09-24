/// <reference types="geojson" />

export type Geoms = GeoJSON.Feature<any> | GeoJSON.FeatureCollection<any> | GeoJSON.GeometryObject | GeoJSON.GeometryCollection;

/**
 * http://turfjs.org/docs/#truncate
 */
export default function truncate<Geom extends Geoms>(
    geojson: Geom,
    precision?: number,
    coordinates?: number,
    mutate?: boolean
): Geom;
