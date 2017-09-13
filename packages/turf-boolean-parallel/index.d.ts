/// <reference types="geojson" />

type Feature = GeoJSON.Feature<any> | GeoJSON.GeometryObject;

/**
 * http://turfjs.org/docs/#booleanparallel
 */
declare function booleanParallel(feature1: Feature, feature2: Feature): boolean;
declare namespace booleanParallel { }
export = booleanParallel;
