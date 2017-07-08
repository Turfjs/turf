/// <reference types="geojson" />

type Point = GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point | number[];
type Geoms = GeoJSON.Feature<any> | GeoJSON.FeatureCollection<any> | GeoJSON.GeometryObject | GeoJSON.GeometryCollection;

/**
 * http://turfjs.org/docs/#transform-rotate
 */
declare function transformRotate<Geom extends Geoms>(
    geojson: Geom,
    angle: number,
    pivot?: Point,
    mutate?: boolean): Geom;

declare namespace transformRotate { }
export = transformRotate;
