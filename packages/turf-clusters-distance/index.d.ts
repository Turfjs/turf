/// <reference types="geojson" />

import {Units, Points, Point} from '@turf/helpers';

interface Output {
    type: 'FeatureCollection'
    features: clustersDistance.Point[];
}

/**
 * http://turfjs.org/docs/#clusterdistance
 */
declare function clustersDistance(
    points: Points | Point[],
    maxDistance: number,
    units?: Units,
    minPoints?: number): Output;

declare namespace clustersDistance {
    type Categories = 'core' | 'edge' | 'noise'
    interface Point extends GeoJSON.Feature<GeoJSON.Point> {
        properties: {
            dbscan?: clustersDistance.Categories;
            cluster?: number;
            [key: string]: any;
        }
    }
}
export = clustersDistance;
