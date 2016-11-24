/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#bezier
 */
declare function bezier(
    line: bezier.LineString,
    resolution?: number,
    sharpness?: number): bezier.LineString;
declare namespace bezier {
    type LineString = GeoJSON.Feature<GeoJSON.LineString>;
}
export = bezier;
