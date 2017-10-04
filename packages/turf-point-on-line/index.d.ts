import { Point, Feature, Units, Position, LineString, MultiLineString } from '@turf/helpers'

export interface PointOnLine extends Feature<Point> {
    properties: {
        index?: number
        dist?: number
        location?: number
        [key: string]: any
    }
}

/**
 * http://turfjs.org/docs/#pointonline
 */
export default function pointOnLine<T extends MultiLineString | LineString>(
    line: Feature<T> | T,
    point: Feature<Point> | Point | Position,
    options?: {
        units?: Units
    }
): PointOnLine;
