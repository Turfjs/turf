/// <reference types="geojson" />

type Feature = GeoJSON.Feature<any>;
type Features = GeoJSON.FeatureCollection<any>;

/**
 * http://turfjs.org/docs/#truncate
 */
declare function truncate<T extends Feature | Features>(layer: T, precision?: number, coordinates?: number): T;
declare namespace truncate { }
export = truncate;
