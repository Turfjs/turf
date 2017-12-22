import { Point, Feature, FeatureCollection, Properties } from '@turf/helpers';

export interface KmeansProps extends Properties {
    cluster?: number;
    centroid?: [number, number];
}

/**
 * http://turfjs.org/docs/#clusterskmeans
 */
export default function (
    points: FeatureCollection<Point>,
    options?: {
        numberOfClusters?: number,
        mutate?: boolean
    }
): FeatureCollection<Point, KmeansProps>;
