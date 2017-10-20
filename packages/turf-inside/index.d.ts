import { MultiPolygon, Polygon, Feature, Coord } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#inside
 */
export default function inside<T extends Polygon | MultiPolygon>(
    point: Coord,
    polygon: Feature<T> | T,
    options?: {
        ignoreBoundary?: boolean
    }
): boolean;
