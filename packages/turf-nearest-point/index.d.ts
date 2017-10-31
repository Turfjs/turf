import { Feature, FeatureCollection, Coord, Point } from '@turf/helpers'

export interface NearestPoint extends Feature<Point> {
    properties: {
        featureIndex: number
        distanceToPoint: number
        [key: string]: any
    }
}

/**
 * http://turfjs.org/docs/#nearest
 */
export default function nearest(
    targetPoint: Coord,
    points: FeatureCollection<Point>
): NearestPoint;
