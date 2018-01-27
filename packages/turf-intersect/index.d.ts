import { Feature, Polygon, MultiPolygon } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#intersect
 */
export default function intersect(
    poly1: Feature<Polygon> | Polygon,
    poly2: Feature<Polygon> | Polygon
): Feature<Polygon | MultiPolygon> | null;
