/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#buffer
 */
declare function buffer(
  features: GeoJSON.Feature<any> | GeoJSON.FeatureCollection<any>,
  radius?: number,
  unit?: string): GeoJSON.Feature<GeoJSON.LineString>;
declare namespace buffer { }
export = buffer;
