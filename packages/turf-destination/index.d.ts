import { Feature, Point, Units, Position } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#destination
 */
export default function destination(
    origin: Feature<Point> | Point | Position,
    distance: number,
    bearing: number,
    options?: {
        units?: Units
    }
): Feature<Point>;
