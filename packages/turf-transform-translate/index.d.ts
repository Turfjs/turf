/// <reference types="geojson" />

type Geoms = GeoJSON.Feature<any> | GeoJSON.FeatureCollection<any> | GeoJSON.GeometryObject | GeoJSON.GeometryCollection;

/**
 * http://turfjs.org/docs/#transform-translate
 */
declare function transformTranslate<Geom extends Geoms>(
    geojson: Geom,
    distance: number,
    direction: number,
    units?: string,
    zTranslation?: number,
    mutate?: boolean): Geom;

declare namespace transformTranslate { }
export = transformTranslate;
