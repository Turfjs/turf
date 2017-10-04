import { Feature, LineString } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#booleanclockwise
 */
export default function (
    line: Feature<LineString> | LineString | number[][]
): boolean;
