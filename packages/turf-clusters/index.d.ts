import {Points} from '@turf/helpers'

interface Clustered {
  points: Points
  centroid: Points
}

/**
 * http://turfjs.org/docs/#cluster
 */
declare function cluster(points: Points, numberOfClusters?: number): Clustered;

declare namespace cluster { }
export = cluster;
