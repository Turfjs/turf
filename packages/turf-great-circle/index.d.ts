import { Point, LineString, Feature, Position } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#greatcircle
 */
export default function greatCircle(
    start: Feature<Point> | Point | Position,
    end: Feature<Point> | Point | Position,
    options?: {
        properties?: object,
        npoints?: number,
        offset?: number
    }
): Feature<LineString>;
