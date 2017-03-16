import {Points, MultiPolygons} from '@turf/helpers'

/**
 * http://turfjs.org/docs/#isobands
 */
declare function isobands(pointGrid: Points, z: string, breaks: Array<number>): MultiPolygons;
declare namespace isobands { }
export = isobands;
