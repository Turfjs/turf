/// <reference types="geojson" />

type Feature = GeoJSON.Feature<any> | GeoJSON.GeometryObject;

/**
 * http://turfjs.org/docs/#pointto-line-distance
 */
declare function pointToLineDistance(feature1: Feature, feature2: Feature): boolean;
declare namespace pointToLineDistance { }
export = pointToLineDistance;
