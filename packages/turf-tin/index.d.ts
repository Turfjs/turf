import { Point, FeatureCollection, Polygon } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#tin
 */
export default function tin(
    points: FeatureCollection<Point>,
    z?: string
): FeatureCollection<Polygon>;
