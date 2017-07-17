/// <reference types="geojson" />

type FeatureCollection<T extends GeoJSON.GeometryObject> = GeoJSON.FeatureCollection<T>;
type Feature<T extends GeoJSON.GeometryObject> = GeoJSON.Feature<T>;
type GeometryObject = GeoJSON.GeometryObject;

/**
 * http://turfjs.org/docs/#getcluster
 */
export function getCluster<T extends GeometryObject>(
    geojson: FeatureCollection<T> | Feature<T>[],
    filter: any
): FeatureCollection<T>;

/**
 * http://turfjs.org/docs/#clustereach
 */
export function clusterEach(geojson: any): any;

/**
 * http://turfjs.org/docs/#clusterreduce
 */
export function clusterReduce(geojson: any): any;
