import { Feature, LineString, Point, Units, Position } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#pointtolinedistance
 */
export default function pointToLineDistance(
    pt: Feature<Point> | Point | Position,
    line: Feature<LineString> | LineString,
    options?: {
        units?: Units,
        mercator?: boolean
    }
): number;
