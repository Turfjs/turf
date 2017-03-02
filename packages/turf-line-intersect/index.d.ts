import {Points, LineString, LineStrings, MultiLineString, MultiLineStrings} from '@turf/helpers';

type Line = LineString | LineStrings | MultiLineString | MultiLineStrings

/**
 * http://turfjs.org/docs/#lineintersect
 */
declare function lineIntersect(line1: Line, line2: Line): Points;
declare namespace lineIntersect { }
export = lineIntersect;
