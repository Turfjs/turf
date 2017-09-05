/// <reference types="geojson" />

type Types = GeoJSON.FeatureCollection<any> | GeoJSON.Feature<any> | GeoJSON.GeometryObject | GeoJSON.GeometryCollection;

/**
 * http://turfjs.org/docs/#toMercator
 */
export function toMercator<T extends Types>(geojson: T, mutate?: boolean): T;

/**
 * http://turfjs.org/docs/#toWgs84
 */
export function toWgs84<T extends Types>(geojson: T, mutate?: boolean): T;
