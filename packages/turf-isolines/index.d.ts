import {Points, MultiLineStrings} from '@turf/helpers'

/**
 * http://turfjs.org/docs/#isolines
 */
declare function isolines(points: Points, breaks: Array<number>, property?: string): MultiLineStrings;
declare namespace isolines { }
export = isolines;
