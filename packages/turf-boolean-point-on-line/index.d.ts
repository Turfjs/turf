/// <reference types="geojson" />

type Feature = GeoJSON.Feature<any> | GeoJSON.GeometryObject;

/**
 * http://turfjs.org/docs/#booleanPointOnLine
 */
declare function booleanPointOnLine(feature1: Feature, feature2: Feature): boolean;
declare namespace booleanPointOnLine { }
export = booleanPointOnLine;
