import { Point, Feature, Units, Coord, Properties } from '@turf/helpers';

/**
 * http://turfjs.org/docs/#rhumbdestination
 */
export default function rhumbDestination<P = Properties>(
    origin: Coord,
    distance: number,
    bearing: number,
    options?: {
        units?: Units,
        properties?: P
    }
): Feature<Point, P>;
