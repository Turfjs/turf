/// <reference types="geojson" />

type Feature = GeoJSON.Feature<GeoJSON.LineString>

/**
 * http://turfjs.org/docs/#boolean-clockwise
 */
declare function clockwise(feature: Feature): boolean;
declare namespace clockwise { }
export = clockwise;
