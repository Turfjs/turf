/// <reference types="geojson" />

import {
    Point,
    Feature,
    FeatureCollection
} from '@turf/helpers';

export interface Output {
    type: 'FeatureCollection'
    features: KmeansPoint[];
}
export interface KmeansPoint extends Feature<Point> {
    properties: {
        cluster?: number;
        centroid?: [number, number];
        [key: string]: any;
    }
}

/**
 * http://turfjs.org/docs/#clusterskmeans
 */
export default function (
    points: FeatureCollection<Point>,
    numberOfClusters?: number,
    mutate?: boolean
): Output;
