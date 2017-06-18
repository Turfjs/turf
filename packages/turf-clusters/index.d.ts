import {Points} from '@turf/helpers'

interface Clustered {
  points: Points
  centroid: Points
}

/**
 * http://turfjs.org/docs/#cluster
 */
declare function clusters(points: Points, numberOfClusters?: number): Clustered;

declare namespace clusters { }
export = clusters;
