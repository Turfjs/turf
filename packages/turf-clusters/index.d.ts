import {Points} from '@turf/helpers'

/**
 * http://turfjs.org/docs/#cluster
 */
declare function cluster(points: Points, breaks?: number): Object;

declare namespace cluster { }
export = cluster;
