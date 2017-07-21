/// <reference types="geojson" />

import {Units, Points} from '@turf/helpers';

interface Output {
    type: 'FeatureCollection'
    features: clustersDbscan.Point[];
}

/**
 * http://turfjs.org/docs/#clustersdbscans
 */
declare function clustersDbscan(
    points: Points,
    maxDistance: number,
    units?: Units,
    minPoints?: number): Output;

declare namespace clustersDbscan {
    type Dbscan = 'core' | 'edge' | 'noise'
    interface Point extends GeoJSON.Feature<GeoJSON.Point> {
        properties: {
            dbscan?: Dbscan;
            cluster?: number;
            [key: string]: any;
        }
    }
}
export = clustersDbscan;
