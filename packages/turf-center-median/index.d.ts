import { Feature, Point, Position, FeatureCollection } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#centermedian
 */

export interface medianProps {
    medianCandidates: Array<Position>,
    [key: string]: any
}

export interface medianCenter extends Feature<Point> {
    properties: medianProps
}

export default function (
    features: FeatureCollection<any>,
    options?: {
        weight?: string,
        tolerance?: number
    }
): medianCenter;
