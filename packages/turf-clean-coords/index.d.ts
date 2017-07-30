/// <reference types="geojson" />

type Feature = GeoJSON.Feature<any> | GeoJSON.GeometryObject;

/**
 * http://turfjs.org/docs/#cleancoords
 */
declare function cleanCoords(feature: Feature, mutate?: boolean): Feature;
declare namespace cleanCoords {}
export = cleanCoords;
