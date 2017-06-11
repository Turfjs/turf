import {Points, MultiLineStrings} from '@turf/helpers'

/**
 * http://turfjs.org/docs/#isolines
 */
declare function isolines(
    points: Points,
    breaks: number[],
    zProperty?:string,
    propertiesToAllIsolines?: Object,
    propertiesPerIsoline?: Object[]): MultiLineStrings;

declare namespace isolines { }
export = isolines;
