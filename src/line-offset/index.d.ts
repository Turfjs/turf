import { Units, Feature, LineString, MultiLineString } from '@turf/helpers';

/**
 * http://turfjs.org/docs/#lineoffset
 */
export default function lineOffset<T extends LineString | MultiLineString>(
    line: Feature<T> | T,
    distance: number,
    options?: {
        units?: Units
    }
): Feature<T>;
