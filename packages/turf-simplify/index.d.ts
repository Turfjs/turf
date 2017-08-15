/// <reference types="geojson" />

type Geoms = GeoJSON.Feature<any> | GeoJSON.FeatureCollection<any> | GeoJSON.GeometryObject | GeoJSON.GeometryCollection;

/**
 * http://turfjs.org/docs/#simplify
 */
declare function simplify<T extends Geoms>(
  geojson: T,
  tolerance?: number,
  highQuality?: boolean,
  mutate?: boolean): T;

declare namespace simplify { }
export = simplify;