import { Feature, LineString } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#boolean-clockwise
 */
export default function clockwise(
    line: Feature<LineString> | LineString | number[][]
): boolean;
