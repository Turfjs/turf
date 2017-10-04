import { Point, Feature, Units, Coord } from '@turf/helpers';

/**
 * http://turfjs.org/docs/#rhumbdestination
 */
export default function rhumbDestination(
    origin: Coord,
    distance: number,
    bearing: number,
    options?: {
        units?: Units
    }
): Feature<Point>;
