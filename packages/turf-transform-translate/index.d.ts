/// <reference types="geojson" />

export type GeometryObject = GeoJSON.GeometryObject;
export type Feature<Geom extends GeometryObject> = GeoJSON.Feature<Geom>;

/**
 * http://turfjs.org/docs/#transform-translate
 */
declare function translate(geojson: Feature<any> | GeometryObject,
                           distance: number, direction: number, units?: string): Feature<any>;
declare namespace translate { }
export = translate;
