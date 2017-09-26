/// <reference types="geojson" />

export type Point = GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point | number[];
export type Geoms = GeoJSON.Feature<any> | GeoJSON.FeatureCollection<any> | GeoJSON.GeometryObject | GeoJSON.GeometryCollection;

/**
 * http://turfjs.org/docs/#transform-rotate
 */
export default function transformRotate<Geom extends Geoms>(
    geojson: Geom,
    angle: number,
    pivot?: Point,
    mutate?: boolean
): Geom;