/// <reference types="geojson" />

type Feature = GeoJSON.Feature<any>;
type Features = GeoJSON.FeatureCollection<any>;
type Geometry = GeoJSON.GeometryObject;
type Geometries = GeoJSON.GeometryCollection;

/**
 * http://turfjs.org/docs/#truncate
 */
declare function truncate<T extends Feature | Features | Geometry | Geometries>(layer: T, precision?: number, coordinates?: number, mutate?: boolean): T;
declare namespace truncate { }
export = truncate;
