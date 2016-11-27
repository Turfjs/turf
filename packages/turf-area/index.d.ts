/// <reference types="geojson" />

type Feature = GeoJSON.Feature<any>;
type Features = GeoJSON.FeatureCollection<any>;

/**
 * http://turfjs.org/docs/#area
 */
declare function area(features: Feature | Features): number;
declare namespace area { }
export = area;
