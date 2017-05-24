/// <reference types="geojson" />

type GeometryObject = GeoJSON.GeometryObject;
type Feature<Geom extends GeometryObject> = GeoJSON.Feature<Geom>;
type Point = Feature<GeoJSON.Point> | GeoJSON.Point | number[];

/**
 * http://turfjs.org/docs/#transform-rotate
 */
declare function rotate<Geom extends GeometryObject>(
    geojson: Feature<Geom> | Geom,
    angle: number,
    pivot?: Point): Feature<Geom>;

declare namespace rotate { }
export = rotate;
