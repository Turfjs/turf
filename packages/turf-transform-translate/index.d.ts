/// <reference types="geojson" />

type GeometryObject = GeoJSON.GeometryObject;
type Feature<Geom extends GeometryObject> = GeoJSON.Feature<Geom>;

/**
 * http://turfjs.org/docs/#transform-translate
 */
declare function translate<Geom extends GeometryObject>(
    geojson: Feature<Geom> | Geom,
    distance: number,
    direction: number,
    units?: string): Feature<Geom>;
declare namespace translate { }
export = translate;
