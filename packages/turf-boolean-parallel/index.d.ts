import { Feature, LineString } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#booleanparallel
 */
export default function (
    feature1: Feature<LineString> | LineString,
    feature2: Feature<LineString> | LineString
): boolean;
