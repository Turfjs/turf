/// <reference types="geojson" />

type Feature = GeoJSON.Feature<any> | GeoJSON.GeometryObject;

/**
 * http://turfjs.org/docs/#tomercator
 */
declare function toMercator(feature1: Feature, feature2: Feature): boolean;
declare namespace toMercator { }
export = toMercator;
