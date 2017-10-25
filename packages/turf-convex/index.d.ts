import { Feature, AllGeoJSON, Polygon } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#convex
 */
export default function convex(
    geojson: AllGeoJSON,
    options?: {
        concavity?: number
    }
): Feature<Polygon>;
