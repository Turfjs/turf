import { Units, AllGeoJSON } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#linedistance
 */
export default function lineDistance(
    geojson: AllGeoJSON,
    options?: {
        units?: Units
    }
): number;
