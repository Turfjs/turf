/// <reference types="geojson" />

type Feature = GeoJSON.Feature<any> | GeoJSON.GeometryObject;

/**
 * http://turfjs.org/docs/#ellipse
 */
declare function ellipse(feature1: Feature, feature2: Feature): boolean;
declare namespace ellipse { }
export = ellipse;
