import {
    Point,
    MultiLineString,
    FeatureCollection,
    Properties
} from '@turf/helpers'

/**
 * http://turfjs.org/docs/#isolines
 */
export default function isolines(
    points: FeatureCollection<Point>,
    breaks: number[],
    zProperty?:string,
    propertiesToAllIsolines?: Properties,
    propertiesPerIsoline?: Properties[]
): FeatureCollection<MultiLineString>;
