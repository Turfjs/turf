/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#collect
 */
declare function collect(
  polygons: GeoJSON.FeatureCollection<GeoJSON.Polygon>,
  points: GeoJSON.FeatureCollection<GeoJSON.Point>,
  inProperty: string,
  outProperty: string): GeoJSON.FeatureCollection<GeoJSON.Polygon>;
declare namespace collect { }
export = collect;