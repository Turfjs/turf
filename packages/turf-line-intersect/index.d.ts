import {
    FeatureCollection,
    Feature,
    Point,
    LineString,
    MultiLineString,
    Polygon,
    MultiPolygon
} from '@turf/helpers'

/**
 * http://turfjs.org/docs/#lineintersect
 */
export default function lineIntersect<T extends LineString, MultiLineString, Polygon, MultiPolygon>(
    line1: Feature<T> | FeatureCollection<T> | T,
    line2: Feature<T> | FeatureCollection<T> | T,
): FeatureCollection<Point>;
