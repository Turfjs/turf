import { Feature, Polygon, Properties, Point } from '@turf/helpers'
 
/**
 * http://turfjs.org/docs/#standarddeviational-ellipse
 */

export default function (
    points: Feature<Point>,
    options?: {
        properties?: Properties,
        weight?: string,
        steps?: number
    }
): Feature<Polygon>
