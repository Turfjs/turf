import { Position, Point, Feature, Units } from '@turf/helpers';

/**
 * http://turfjs.org/docs/#rhumb-distance
 */
export default function rhumbDistance(
    from: Feature<Point> | Point | Position,
    to: Feature<Point> | Point | Position,
    options?: {
        units?: Units;
    }
): number;
