/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#bearing
 */
declare function bearing(
  start: GeoJSON.Feature<GeoJSON.Point>,
  end: GeoJSON.Feature<GeoJSON.Point>): number;
declare namespace bearing { }
export = bearing;
