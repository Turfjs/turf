import { AllGeoJSON } from '@turf/helpers';

/**
 * http://turfjs.org/docs/#truncate
 */
export default function truncate<T extends AllGeoJSON>(
    geojson: T,
    options?: {
        precision?: number,
        coordinates?: number,
        mutate?: boolean
    }
): T;
