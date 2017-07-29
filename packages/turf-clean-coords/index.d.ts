/// <reference types="geojson" />

type Feature = GeoJSON.Feature<any> | GeoJSON.GeometryObject;

/**
 * http://turfjs.org/docs/#clearcoords
 */
declare function clearCoords(feature1: Feature, feature2: Feature): boolean;
declare namespace clearCoords { }
export = clearCoords;
