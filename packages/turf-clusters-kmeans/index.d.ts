import { Point, Feature, FeatureCollection } from '@turf/helpers';

export interface KmeansProps {
    cluster?: number;
    centroid?: [number, number];
    [key: string]: any;
}
export interface KmeansPoint extends Feature<Point> {
    properties: KmeansProps
}
export interface KmeansPoints {
    type: 'FeatureCollection'
    features: KmeansPoint[];
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
): KmeansPoints;
