import { MultiPolygon, Polygon, Feature, Coord } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#booleanpointinpolygon
 */
export default function booleanPointInPolygon<T extends Polygon | MultiPolygon>(
    point: Coord,
    polygon: Feature<T> | T,
    options?: {
        ignoreBoundary?: boolean
    }
): boolean;
