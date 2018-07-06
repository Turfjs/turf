import { Feature, LineString, Coord } from '../helpers'

/**
 * http://turfjs.org/docs/#lineslice
 */
export default function lineSlice(
    startPt: Coord,
    stopPt: Coord,
    line: Feature<LineString> | LineString
): Feature<LineString>;
