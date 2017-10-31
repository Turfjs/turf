import { Units, AllGeoJSON } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#length
 */
export default function length(
    geojson: AllGeoJSON,
    options?: {
        units?: Units
    }
): number;
