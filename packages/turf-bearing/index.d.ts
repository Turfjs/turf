import { Point, Feature, Position } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#bearing
 */
export default function bearing(
    start: Feature<Point> | Point | Position,
    end: Feature<Point> | Point | Position,
    options?: {
        final?: boolean
    }
): number;
