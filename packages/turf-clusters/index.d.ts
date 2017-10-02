import { FeatureCollection, GeometryObject, Feature } from '@turf/helpers'
/**
 * http://turfjs.org/docs/#getcluster
 */
export function getCluster<T extends GeometryObject>(
    geojson: FeatureCollection<T>,
    filter: any
): FeatureCollection<T>;

/**
 * http://turfjs.org/docs/#clustereach
 */
export function clusterEach<T extends GeometryObject>(
    geojson: FeatureCollection<T>,
    property: number | string,
    callback: (cluster?: FeatureCollection<T>, clusterValue?: any, currentIndex?: number) => void
): void;

/**
 * http://turfjs.org/docs/#clusterreduce
 */
export function clusterReduce<T extends GeometryObject>(
    geojson: FeatureCollection<T>,
    property: number | string,
    callback: (previousValue?: any, cluster?: FeatureCollection<T>, clusterValue?: any, currentIndex?: number) => void,
    initialValue?: any
): void;
