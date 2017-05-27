/// <reference types="geojson" />

type Geoms = GeoJSON.Feature<any> | GeoJSON.FeatureCollection<any> | GeoJSON.GeometryObject | GeoJSON.GeometryCollection;

/**
 * http://turfjs.org/docs/#transform-scale
 */
declare function scale<Geom extends Geoms>(
    geojson: Geom,
    factor: number,
    fromCenter: boolean,
    mutate?: boolean): Geom;

declare namespace scale { }
export = scale;
