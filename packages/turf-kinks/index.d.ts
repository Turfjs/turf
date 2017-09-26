import {
    LineString,
    MultiLineString,
    Polygon,
    MultiPolygon,
    Point,
    FeatureCollection,
    Feature
} from '@turf/helpers'

/**
 * http://turfjs.org/docs/#kinks
 */
export default function kinks<T extends LineString | MultiLineString | Polygon | MultiPolygon>(
    featureIn: Feature<T> | T
): FeatureCollection<Point>;
