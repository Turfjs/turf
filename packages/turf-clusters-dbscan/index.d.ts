/// <reference types="geojson" />

import {Units, Points, Point} from '@turf/helpers';

interface Output {
    type: 'FeatureCollection'
    features: clusters.Point[];
}

/**
 * http://turfjs.org/docs/#clustersdbscans
 */
declare function clusters(
    points: Points | Point[],
    maxDistance: number,
    units?: Units,
    minPoints?: number): Output;

declare namespace clusters {
    type Categories = 'core' | 'edge' | 'noise'
    interface Point extends GeoJSON.Feature<GeoJSON.Point> {
        properties: {
            dbscan?: clusters.Categories;
            cluster?: number;
            [key: string]: any;
        }
    }
}
export = clusters;
