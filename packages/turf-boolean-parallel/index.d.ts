import { Feature, LineString } from '@turf/helpers';
/**
 * Boolean-Parallel returns True if each segment of `line1` is parallel to the correspondent segment of `line2`
 *
 * @name booleanParallel
 * @param {Geometry|Feature<LineString>} line1 GeoJSON Feature or Geometry
 * @param {Geometry|Feature<LineString>} line2 GeoJSON Feature or Geometry
 * @returns {boolean} true/false if the lines are parallel
 * @example
 * var line1 = turf.lineString([[0, 0], [0, 1]]);
 * var line2 = turf.lineString([[1, 0], [1, 1]]);
 *
 * turf.booleanParallel(line1, line2);
 * //=true
 */
declare function booleanParallel(line1: Feature<LineString> | LineString, line2: Feature<LineString> | LineString): boolean;
export default booleanParallel;
