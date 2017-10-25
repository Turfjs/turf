import { BBox, Point, FeatureCollection, Polygon } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#tag
 */
export default function tag(
    points: FeatureCollection<Point>,
    polygons: FeatureCollection<Polygon>,
    field: string,
    outField: string
): FeatureCollection<Point>;
