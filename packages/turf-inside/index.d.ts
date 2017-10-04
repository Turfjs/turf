import { Point, MultiPolygon, Polygon, Feature, Position } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#inside
 */
export default function inside<T extends Polygon | MultiPolygon>(
    point: Feature<Point> | Point | Position,
    polygon: Feature<T> | T,
    options?: {
      ignoreBoundary?: boolean
    }
): boolean;
