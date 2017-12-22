import { FeatureCollection, GeometryObject, Feature, Properties } from '@turf/helpers'
/**
 * http://turfjs.org/docs/#getcluster
 */
export function getCluster<T extends GeometryObject, P = Properties>(
    geojson: FeatureCollection<T, P>,
    filter: any
): FeatureCollection<T, P>;

/**
 * http://turfjs.org/docs/#clustereach
 */
export function clusterEach<T extends GeometryObject, P = Properties>(
    geojson: FeatureCollection<T, P>,
    property: number | string,
    callback: (cluster?: FeatureCollection<T, P>, clusterValue?: any, currentIndex?: number) => void
): void;

/**
 * http://turfjs.org/docs/#clusterreduce
 */
export function clusterReduce<T extends GeometryObject, P = Properties>(
    geojson: FeatureCollection<T, P>,
    property: number | string,
    callback: (previousValue?: any, cluster?: FeatureCollection<T, P>, clusterValue?: any, currentIndex?: number) => void,
    initialValue?: any
): void;
