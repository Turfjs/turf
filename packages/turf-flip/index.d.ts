/// <reference types="geojson" />

export type Feature = GeoJSON.Feature<any>;
export type Features = GeoJSON.FeatureCollection<any>;
export type Geometry = GeoJSON.GeometryObject;
export type Geometries = GeoJSON.GeometryCollection;

export default function flip<T extends Features|Feature|Geometry|Geometries>(geojson: T, mutate?: boolean): T
