/// <reference types="geojson" />

export type Types = GeoJSON.FeatureCollection<any> | GeoJSON.Feature<any> | GeoJSON.GeometryObject | GeoJSON.GeometryCollection;

interface Options {
  /**
   * allows GeoJSON input to be mutated (significant performance increase if true)
   */
  mutate?: boolean
}

/**
 * http://turfjs.org/docs/#toMercator
 */
export function toMercator<T extends Types>(geojson: T, options?: Options): T;

/**
 * http://turfjs.org/docs/#toWgs84
 */
export function toWgs84<T extends Types>(geojson: T, options?: Options): T;
