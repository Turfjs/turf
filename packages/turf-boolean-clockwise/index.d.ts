/// <reference types="geojson" />

type Feature = GeoJSON.Feature<GeoJSON.LineString | GeoJSON.Polygon>

/**
 * http://turfjs.org/docs/#boolean-clockwise
 */
declare function clockwise(feature: Feature): boolean;
declare namespace clockwise { }
export = clockwise;
