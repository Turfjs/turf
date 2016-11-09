/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#along
 */
declare function along(
  line: GeoJSON.Feature<GeoJSON.LineString>,
  distance: number,
  units?: string): GeoJSON.Feature<GeoJSON.Point>;

declare namespace along { }
export = along;
