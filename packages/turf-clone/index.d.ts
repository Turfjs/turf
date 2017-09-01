/// <reference types="geojson" />

type Types = GeoJSON.FeatureCollection<any> | GeoJSON.Feature<any> | GeoJSON.GeometryObject | GeoJSON.GeometryCollection;

/**
 * http://turfjs.org/docs/#clone
 */
declare function clone<T extends Types>(geojson: T): T;
declare namespace clone { }
export = clone;
