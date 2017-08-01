/// <reference types="geojson" />

type GeometryObject = GeoJSON.GeometryObject;
type Feature = GeoJSON.Feature<any>;

/**
 * http://turfjs.org/docs/#cleancoords
 */
declare function cleanCoords<T extends GeometryObject|Feature>(feature: T, mutate?: boolean): T;
declare namespace cleanCoords {}
export = cleanCoords;
