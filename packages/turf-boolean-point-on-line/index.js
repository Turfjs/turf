import { getCoords, getCoord } from '@turf/invariant';
import { isObject } from '@turf/helpers';

/**
 * Returns true if a point is on a line. Accepts a optional parameter to ignore the start and end vertices of the linestring.
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
function booleanPointOnLine(pt, line, options) {
    // Optional parameters
    options = options || {};
    var ignoreEndVertices = options.ignoreEndVertices;
    if (!isObject(options)) throw new Error('invalid options');

    // Validate input
    if (!pt) throw new Error('pt is required');
    if (!line) throw new Error('line is required');

    // Normalize inputs
    var ptCoords = getCoord(pt);
    var lineCoords = getCoords(line);

    // Main
    for (var i = 0; i < lineCoords.length - 1; i++) {
        var ignoreBoundary = false;
        if (ignoreEndVertices) {
            if (i === 0) ignoreBoundary = 'start';
            if (i === lineCoords.length - 2) ignoreBoundary = 'end';
            if (i === 0 && i + 1 === lineCoords.length - 1) ignoreBoundary = 'both';
        }
        if (isPointOnLineSegment(lineCoords[i], lineCoords[i + 1], ptCoords, ignoreBoundary)) return true;
    }
    return false;
}

// See http://stackoverflow.com/a/4833823/1979085
/**
 * @private
 * @param {Position} lineSegmentStart coord pair of start of line
 * @param {Position} lineSegmentEnd coord pair of end of line
 * @param {Position} pt coord pair of point to check
 * @param {boolean|string} excludeBoundary whether the point is allowed to fall on the line ends. If true which end to ignore.
 * @returns {boolean} true/false
 */
function isPointOnLineSegment(lineSegmentStart, lineSegmentEnd, pt, excludeBoundary) {
    var x = pt[0];
    var y = pt[1];
    var x1 = lineSegmentStart[0];
    var y1 = lineSegmentStart[1];
    var x2 = lineSegmentEnd[0];
    var y2 = lineSegmentEnd[1];
    var dxc = pt[0] - x1;
    var dyc = pt[1] - y1;
    var dxl = x2 - x1;
    var dyl = y2 - y1;
    var cross = dxc * dyl - dyc * dxl;
    if (cross !== 0) {
        return false;
    }
    if (!excludeBoundary) {
        if (Math.abs(dxl) >= Math.abs(dyl)) {
            return dxl > 0 ? x1 <= x && x <= x2 : x2 <= x && x <= x1;
        }
        return dyl > 0 ? y1 <= y && y <= y2 : y2 <= y && y <= y1;
    } else if (excludeBoundary === 'start') {
        if (Math.abs(dxl) >= Math.abs(dyl)) {
            return dxl > 0 ? x1 < x && x <= x2 : x2 <= x && x < x1;
        }
        return dyl > 0 ? y1 < y && y <= y2 : y2 <= y && y < y1;
    } else if (excludeBoundary === 'end') {
        if (Math.abs(dxl) >= Math.abs(dyl)) {
            return dxl > 0 ? x1 <= x && x < x2 : x2 < x && x <= x1;
        }
        return dyl > 0 ? y1 <= y && y < y2 : y2 < y && y <= y1;
    } else if (excludeBoundary === 'both') {
        if (Math.abs(dxl) >= Math.abs(dyl)) {
            return dxl > 0 ? x1 < x && x < x2 : x2 < x && x < x1;
        }
        return dyl > 0 ? y1 < y && y < y2 : y2 < y && y < y1;
    }
}

export default booleanPointOnLine;
