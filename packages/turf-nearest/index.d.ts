import { Feature, FeatureCollection, Coord, Point } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#nearest
 */
export default function nearest(
    targetPoint: Coord,
    points: FeatureCollection<Point>
): Feature<Point>;
