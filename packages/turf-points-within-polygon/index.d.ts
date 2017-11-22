import { FeatureCollection, Polygon, MultiPolygon, Point } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#pointswithinpolygon
 */
export default function pointsWithinPolygon(
    points: FeatureCollection<Point>,
    polygons: FeatureCollection<Polygon | MultiPolygon>
): FeatureCollection<Point>;
