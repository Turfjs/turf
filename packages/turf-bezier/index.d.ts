import { LineString, Feature } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#bezier
 */
export default function bezier(
    line: Feature<LineString> | LineString,
    options?: {
        resolution?: number;
        sharpness?: number;
    }
): Feature<LineString>;
