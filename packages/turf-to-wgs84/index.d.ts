/// <reference types="geojson" />

type Feature = GeoJSON.Feature<any> | GeoJSON.GeometryObject;

/**
 * http://turfjs.org/docs/#towgs84
 */
declare function toWgs84(feature1: Feature, feature2: Feature): boolean;
declare namespace toWgs84 { }
export = toWgs84;
