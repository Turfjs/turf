/// <reference types="geojson" />

export type Geoms = GeoJSON.Feature<any> | GeoJSON.FeatureCollection<any> | GeoJSON.GeometryObject | GeoJSON.GeometryCollection;

/**
 * http://turfjs.org/docs/#simplify
 */
export default function simplify<T extends Geoms>(
  geojson: T,
  tolerance?: number,
  highQuality?: boolean,
  mutate?: boolean): T;
