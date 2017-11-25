import { FeatureCollection, Polygon, Properties, Point } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#standarddeviational-ellipse
 */

export default function (
    points: FeatureCollection<Point>,
    options?: {
        properties?: Properties,
        weight?: string,
        steps?: number
    }
): Feature<Polygon>
