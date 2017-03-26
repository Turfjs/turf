import {LineString, Polygon, LineStrings} from '@turf/helpers';

type Line = LineString | Polygon

/**
 * http://turfjs.org/docs/#lineslit
 */
declare function lineSplit(source: Line, target: Line): LineStrings;
declare namespace lineSplit { }
export = lineSplit;
