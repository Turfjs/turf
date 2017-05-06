/// <reference types="geojson" />

type Feature = GeoJSON.Feature<any>;
type Features = GeoJSON.FeatureCollection<any>;
type Geometry = GeoJSON.GeometryObject;
type Geometries = GeoJSON.GeometryCollection;
type Truncate = Feature | Features | Geometry | Geometries;

/**
 * http://turfjs.org/docs/#truncate
 */
declare function truncate<Input extends Truncate>(geojson: Input, precision?: number, coordinates?: number, mutate?: boolean): Input;
declare namespace truncate { }
export = truncate;
