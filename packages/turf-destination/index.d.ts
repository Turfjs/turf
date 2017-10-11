import { Feature, Point, Units, Coord } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#destination
 */
export default function destination(
    origin: Coord,
    distance: number,
    bearing: number,
    options?: {
        units?: Units
    }
): Feature<Point>;
