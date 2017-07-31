/// <reference types="geojson" />

import {Points} from '@turf/helpers';

interface Output {
    type: 'FeatureCollection'
    features: clustersKmeans.Point[];
}

/**
 * http://turfjs.org/docs/#clusterskmeans
 */
declare function clustersKmeans(
    points: Points,
    numberOfClusters?: number,
    mutate?: boolean): Output;

declare namespace clustersKmeans {
    interface Point extends GeoJSON.Feature<GeoJSON.Point> {
        properties: {
            cluster?: number;
            centroid?: [number, number];
            [key: string]: any;
        }
    }
}
export = clustersKmeans;
