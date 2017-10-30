import { Point, Feature, Units, Coord, LineString, MultiLineString } from '@turf/helpers'

export interface NearestPointOnLine extends Feature<Point> {
    properties: {
        index?: number
        dist?: number
        location?: number
        [key: string]: any
    }
}

/**
 * http://turfjs.org/docs/#nearestpointonline
 */
export default function nearestPointOnLine<T extends MultiLineString | LineString>(
    line: Feature<T> | T,
    point: Coord,
    options?: {
        units?: Units
    }
): NearestPointOnLine;
