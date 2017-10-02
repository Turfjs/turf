import { Units, Point, Feature, Position } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#distance
 */
export default function distance(
    from: Feature<Point> | Point | Position,
    to: Feature<Point> | Point | Position,
    options?: {
        units?: Units
    }
): number;
