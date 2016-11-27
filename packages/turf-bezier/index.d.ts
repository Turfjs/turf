/// <reference types="geojson" />

type LineString = GeoJSON.Feature<GeoJSON.LineString>;

/**
 * http://turfjs.org/docs/#bezier
 */
declare function bezier(line: LineString, resolution?: number, sharpness?: number): LineString;
declare namespace bezier { }
export = bezier;
