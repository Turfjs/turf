import {Points, MultiLineStrings} from '@turf/helpers'

interface Properties {
    perIsoline: Array<Object>,
    toAllIsolines: Object
}

/**
 * http://turfjs.org/docs/#isolines
 */
declare function isolines(points: Points, breaks: Array<number>, zProperty?:string, properties?: Properties): MultiLineStrings;
declare namespace isolines { }
export = isolines;
