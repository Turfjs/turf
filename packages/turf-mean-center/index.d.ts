import { FeatureCollection, Point } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#meancenter
 */
export default function (
    collection: FeatureCollection<Point>,
    weight?: string
): Feature<Point>;
