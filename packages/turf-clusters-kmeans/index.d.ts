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
    numberOfClusters?: number): Output;

declare namespace clustersKmeans {
    interface Point extends GeoJSON.Feature<GeoJSON.Point> {
        properties: {
            cluster?: number;
            [key: string]: any;
        }
    }
}
export = clustersKmeans;
