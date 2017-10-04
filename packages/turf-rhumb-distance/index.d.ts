import { Coord, Units } from '@turf/helpers';

/**
 * http://turfjs.org/docs/#rhumbdistance
 */
export default function rhumbDistance(
    from: Coord,
    to: Coord,
    options?: {
        units?: Units;
    }
): number;
