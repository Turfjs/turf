import {Points, MultiPolygons} from '@turf/helpers'

/**
 * http://turfjs.org/docs/#isobands
 */
declare function isobands(points: Points, breaks: Array<number>, property?: string): MultiPolygons;
declare namespace isobands { }
export = isobands;
