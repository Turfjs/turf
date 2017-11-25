import { Feature, GeometryObject } from '@turf/helpers'
 
/**
 * http://turfjs.org/docs/#centermedian
 */

export default function (
    points: Feature<any> | GeometryObject,
    tolerance: number
): Feature<Point>;
