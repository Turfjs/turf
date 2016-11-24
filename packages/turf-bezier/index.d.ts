/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#bezier
 */
declare function bezier(
  line: GeoJSON.Feature<GeoJSON.LineString>,
  resolution?: number,
  sharpness?: number): GeoJSON.Feature<GeoJSON.LineString>;
declare namespace bezier { }
export = bezier;
