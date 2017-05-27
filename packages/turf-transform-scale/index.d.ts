/// <reference types="geojson" />

type Geoms = GeoJSON.Feature<any> | GeoJSON.FeatureCollection<any> | GeoJSON.GeometryObject | GeoJSON.GeometryCollection;
type Corners = 'sw' | 'se' | 'nw' | 'ne' | 'center' | 'centroid' | undefined | null;

/**
 * http://turfjs.org/docs/#transform-scale
 */
declare function scale<Geom extends Geoms>(
    geojson: Geom,
    factor: number,
    fromCorner?: Corners,
    mutate?: boolean): Geom;

declare namespace scale { }
export = scale;
