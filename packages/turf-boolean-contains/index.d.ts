import { Feature, GeometryObject } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#boolean-contains
 */
export default function (
    feature1: Feature<any> | GeometryObject,
    feature2: Feature<any> | GeometryObject
): boolean;
