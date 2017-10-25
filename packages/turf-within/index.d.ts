import { FeatureCollection, Polygon, Point } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#within
 */
export default function within(
    points: FeatureCollection<Point>,
    polygons: FeatureCollection<Polygon>
): FeatureCollection<Point>;
