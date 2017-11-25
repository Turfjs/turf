import { Feature, Point, Coord, FeatureCollection } from '@turf/helpers'
 
/**
 * http://turfjs.org/docs/#centermedian
 */

export interface medianProps {
    medianCandidates: Array<Coord>,
    [key: string]: any
}

export interface medianCenter extends Feature<Point> {
    properties: medianProps
}

export default function (
    features: FeatureCollection<Point>,
    options?: {
        weight?: string,
        tolerance?: number
    }
): medianCenter;
