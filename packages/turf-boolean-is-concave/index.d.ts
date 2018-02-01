import { Feature, Polygon } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#booleanIsConcave
 */
export default function (
    polygon: Feature<Polygon> | Polygon
): boolean;
