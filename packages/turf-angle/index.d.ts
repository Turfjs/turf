import { Coord } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#angle
 */
export default function (
    startPoint: Coord,
    midPoint: Coord,
    endPoint: Coord,
    options?: {
        explementary?: boolean
        mercator?: boolean
    }
 ): number
