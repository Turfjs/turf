/// <reference types="geojson" />

import {
    Units,
    FeatureCollection,
    Point,
    Feature
} from '@turf/helpers';

export interface Output {
    type: 'FeatureCollection'
    features: DbscanPoint[];
}

export type Dbscan = 'core' | 'edge' | 'noise'
export interface DbscanPoint extends Feature<Point> {
    properties: {
        dbscan?: Dbscan;
        cluster?: number;
        [key: string]: any;
    }
}

/**
 * http://turfjs.org/docs/#clustersdbscans
 */
export default function (
    points: FeatureCollection<Point>,
    maxDistance: number,
    units?: Units,
    minPoints?: number
): Output;

