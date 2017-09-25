/// <reference types="geojson" />

import { Points } from '@turf/helpers';

export interface Output {
    type: 'FeatureCollection'
    features: Point[];
}
export interface Point extends GeoJSON.Feature<GeoJSON.Point> {
    properties: {
        cluster?: number;
        centroid?: [number, number];
        [key: string]: any;
    }
}

/**
 * http://turfjs.org/docs/#clusterskmeans
 */
export default function (points: Points, numberOfClusters?: number, mutate?: boolean): Output;
