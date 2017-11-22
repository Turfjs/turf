import { Feature, FeatureCollection, Polygon, MultiPolygon, Point } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#pointswithinpolygon
 */
export default function pointsWithinPolygon<G extends Polygon | MultiPolygon>(
    points: Feature<Point> | FeatureCollection<Point>,
    polygons: Feature<G> | FeatureCollection<G> | G
): FeatureCollection<Point>;
