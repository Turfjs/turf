import { Coord, Feature, LineString } from "@turf/helpers";
/**
 * Returns true if a point is on a line. Accepts a optional parameter to ignore the
 * start and end vertices of the linestring.
 *
 * @name booleanPointOnLine
 * @param {Coord} pt GeoJSON Point
 * @param {Feature<LineString>} line GeoJSON LineString
 * @param {Object} [options={}] Optional parameters
 * @param {boolean} [options.ignoreEndVertices=false] whether to ignore the start and end vertices.
 * @returns {boolean} true/false
 * @example
 * var pt = turf.point([0, 0]);
 * var line = turf.lineString([[-1, -1],[1, 1],[1.5, 2.2]]);
 * var isPointOnLine = turf.booleanPointOnLine(pt, line);
 * //=true
 */
declare function booleanPointOnLine(pt: Coord, line: Feature<LineString> | LineString, options?: {
    ignoreEndVertices?: boolean;
}): boolean;
export default booleanPointOnLine;
