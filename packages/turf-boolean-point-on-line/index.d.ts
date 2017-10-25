import { LineString, Feature, Coord } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#booleanpointonline
 */
export default function (
    point: Coord,
    linestring: Feature<LineString> | LineString,
    options?: {
        ignoreEndVertices?: boolean
    }
): boolean;
