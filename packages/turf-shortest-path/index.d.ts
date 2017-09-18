/// <reference types="geojson" />

type Feature = GeoJSON.Feature<any> | GeoJSON.GeometryObject;

/**
 * http://turfjs.org/docs/#shortestpath
 */
declare function shortestPath(feature1: Feature, feature2: Feature): boolean;
declare namespace shortestPath { }
export = shortestPath;
