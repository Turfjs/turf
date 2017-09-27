import { Point, Feature, Units, Position } from '@turf/helpers';

/**
 * http://turfjs.org/docs/#rhumb-destination
 */
export default function rhumbDestination(
    origin: Feature<Point> | Point | Position,
    distance: number,
    bearing: number,
    options?: {
        units?: Units
    }
): Feature<Point>;
