import {
    LineString,
    LineStrings,
    MultiLineString,
    MultiLineStrings,
    Units
} from '@turf/helpers'

type FeatureIn = LineString | LineStrings | MultiLineString | MultiLineStrings;

/**
 * http://turfjs.org/docs/#linechunk
 */
declare function lineChunk(featureIn: FeatureIn, segmentLength: number, unit?: Units): LineStrings;
declare namespace lineChunk {}
export = lineChunk;
