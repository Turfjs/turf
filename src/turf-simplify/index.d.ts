import { AllGeoJSON } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#simplify
 */
export default function simplify<T extends AllGeoJSON>(
    geojson: T,
    options?: {
        tolerance?: number,
        highQuality?: boolean,
        mutate?: boolean
    }
): T;
