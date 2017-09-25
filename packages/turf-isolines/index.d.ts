import { Points, MultiLineStrings } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#isolines
 */
export default function isolines(
    points: Points,
    breaks: number[],
    zProperty?:string,
    propertiesToAllIsolines?: Object,
    propertiesPerIsoline?: Object[]): MultiLineStrings;
