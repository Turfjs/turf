/// <reference types="geojson" />

import {Units, Points} from '@turf/helpers';

interface Output {
    edges: Points;
    points: Points;
    noise: Points;
    centroids: Points;
}

/**
 * http://turfjs.org/docs/#clusterdistance
 */
declare function clustersDistance(points: Points, maxDistance: number, units?: Units, minPoints?: number): Output;
declare namespace clustersDistance { }
export = clustersDistance;
