/// <reference types="geojson" />

type Feature = GeoJSON.Feature<any>;
type Features = GeoJSON.FeatureCollection<any>;
type Geometry = GeoJSON.GeometryObject;
type Geometries = GeoJSON.GeometryCollection;

declare function flip<T extends Features|Feature|Geometry|Geometries>(geojson: T, mutate?: boolean): T
declare namespace flip { }
export = flip;
