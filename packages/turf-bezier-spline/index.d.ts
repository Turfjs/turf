import { LineString, Feature } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#bezierspline
 */
export default function bezierSpline(
    line: Feature<LineString> | LineString,
    options?: {
        resolution?: number;
        sharpness?: number;
    }
): Feature<LineString>;
