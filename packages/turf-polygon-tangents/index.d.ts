import { Feature, FeatureCollection, Coord, Point, Polygon, MultiPolygon } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#polygontangents
 */
export default function <T extends Polygon | MultiPolygon>(
    point: Coord,
    polygon: Feature<T> | T
): FeatureCollection<Point>;
