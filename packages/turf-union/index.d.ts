import { Feature, Polygon, MultiPolygon } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#union
 */
export default function (
    ...features: Feature<Polygon>[]
): Feature<Polygon | MultiPolygon>;
