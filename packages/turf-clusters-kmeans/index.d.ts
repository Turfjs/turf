/// <reference types="geojson" />

import {Points} from '@turf/helpers';

interface Clustered {
    points: Points;
    centroid: Points;
}

/**
 * http://turfjs.org/docs/#clusterskmeans
 */
declare function clustersKmeans(
    points: Points,
    numberOfClusters?: number): Clustered;

declare namespace clustersKmeans { }
export = clustersKmeans;
