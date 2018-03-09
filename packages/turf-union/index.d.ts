import { Feature, Polygon, MultiPolygon } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#union
 */
export default function (
    polygon1: Feature<Polygon | MultiPolygon> | Polygon | MultiPolygon,
    polygon2: Feature<Polygon | MultiPolygon> | Polygon | MultiPolygon
): Feature<Polygon | MultiPolygon>;
