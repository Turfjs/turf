/// <reference types="geojson" />

type Geoms = GeoJSON.Feature<any> | GeoJSON.FeatureCollection<any> | GeoJSON.GeometryObject | GeoJSON.GeometryCollection;
type Point = GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point | number[];
type Corners = 'sw' | 'se' | 'nw' | 'ne' | 'center' | 'centroid' | undefined | null;

/**
 * http://turfjs.org/docs/#transform-scale
 */
declare function transformScale<Geom extends Geoms>(
    geojson: Geom,
    factor: number,
    origin?: Corners | Point,
    mutate?: boolean): Geom;

declare namespace transformScale { }
export = transformScale;
