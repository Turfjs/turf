import { Point, Feature, Position } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#rhumb-bearing
 */
export default function rhumbBearing(
    start: Feature<Point> | Point | Position,
    end: Feature<Point> | Point | Position,
    options?: {
        final?: boolean;
    }
): number;
