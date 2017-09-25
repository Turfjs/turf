/// <reference types="geojson" />

import {Units, Points} from '@turf/helpers';

export interface Output {
    type: 'FeatureCollection'
    features: Point[];
}
export type Dbscan = 'core' | 'edge' | 'noise'
export interface Point extends GeoJSON.Feature<GeoJSON.Point> {
    properties: {
        dbscan?: Dbscan;
        cluster?: number;
        [key: string]: any;
    }
}

/**
 * http://turfjs.org/docs/#clustersdbscans
 */
export default function (points: Points, maxDistance: number, units?: Units, minPoints?: number): Output;

