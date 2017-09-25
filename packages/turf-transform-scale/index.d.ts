/// <reference types="geojson" />

export type Geoms = GeoJSON.Feature<any> | GeoJSON.FeatureCollection<any> | GeoJSON.GeometryObject | GeoJSON.GeometryCollection;
export type Point = GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point | number[];
export type Corners = 'sw' | 'se' | 'nw' | 'ne' | 'center' | 'centroid' | undefined | null;

/**
 * http://turfjs.org/docs/#transform-scale
 */
export default function transformScale<Geom extends Geoms>(
    geojson: Geom,
    factor: number,
    origin?: Corners | Point,
    mutate?: boolean
): Geom;
