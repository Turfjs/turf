import { Coord } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#rhumbbearing
 */
export default function rhumbBearing(
    start: Coord,
    end: Coord,
    options?: {
        final?: boolean;
    }
): number;
