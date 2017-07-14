/// <reference types="geojson" />

import {Units, Points} from '@turf/helpers';

interface Point extends GeoJSON.Feature<GeoJSON.Point> {
    properties: {
        dbscan?: clustersDistance.DBSCANProps;
        cluster?: number;
        [key: string]: any;
    }
}

interface Output {
    type: 'FeatureCollection'
    features: Point[];
}

/**
 * http://turfjs.org/docs/#clusterdistance
 */
declare function clustersDistance(
    points: Points,
    maxDistance: number,
    units?: Units,
    minPoints?: number): Output;

declare namespace clustersDistance {
    type DBSCANProps = 'core' | 'edge' | 'noise'
}
export = clustersDistance;
