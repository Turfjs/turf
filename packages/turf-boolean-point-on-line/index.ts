import { Feature, LineString } from "geojson";
import { Coord } from "@turf/helpers";
import { getCoord, getCoords } from "@turf/invariant";

/**
 * Returns true if a point is on a line. Accepts a optional parameter to ignore the
 * start and end vertices of the linestring.
 *
 * @name booleanPointOnLine
 * @param {Coord} pt GeoJSON Point
 * @param {Feature<LineString>} line GeoJSON LineString
 * @param {Object} [options={}] Optional parameters
 * @param {boolean} [options.ignoreEndVertices=false] whether to ignore the start and end vertices.
 * @param {number} [options.epsilon] Fractional number to compare with the cross product result. Useful for dealing with floating points such as lng/lat points
 * @returns {boolean} true/false
 * @example
 * var pt = turf.point([0, 0]);
 * var line = turf.lineString([[-1, -1],[1, 1],[1.5, 2.2]]);
 * var isPointOnLine = turf.booleanPointOnLine(pt, line);
 * //=true
 */
function booleanPointOnLine(
  pt: Coord,
  line: Feature<LineString> | LineString,
  options: {
    ignoreEndVertices?: boolean;
    epsilon?: number;
  } = {}
): boolean {
  // Normalize inputs
  const ptCoords = getCoord(pt);
  const lineCoords = getCoords(line);

  // Main
  for (let i = 0; i < lineCoords.length - 1; i++) {
    let ignoreBoundary: boolean | string = false;
    if (options.ignoreEndVertices) {
      if (i === 0) {
        ignoreBoundary = "start";
      }
      if (i === lineCoords.length - 2) {
        ignoreBoundary = "end";
      }
      if (i === 0 && i + 1 === lineCoords.length - 1) {
        ignoreBoundary = "both";
      }
    }
    if (
      isPointOnLineSegment(
        lineCoords[i],
        lineCoords[i + 1],
        ptCoords,
        ignoreBoundary,
        typeof options.epsilon === "undefined" ? null : options.epsilon
      )
    ) {
      return true;
    }
  }
  return false;
}

// See http://stackoverflow.com/a/4833823/1979085
// See https://stackoverflow.com/a/328122/1048847
/**
 * @private
 * @param {Position} lineSegmentStart coord pair of start of line
 * @param {Position} lineSegmentEnd coord pair of end of line
 * @param {Position} pt coord pair of point to check
 * @param {boolean|string} excludeBoundary whether the point is allowed to fall on the line ends.
 * @param {number} epsilon Fractional number to compare with the cross product result. Useful for dealing with floating points such as lng/lat points
 * If true which end to ignore.
 * @returns {boolean} true/false
 */
function isPointOnLineSegment(
  lineSegmentStart: number[],
  lineSegmentEnd: number[],
  pt: number[],
  excludeBoundary: string | boolean,
  epsilon: number | null
): boolean {
  const x = pt[0];
  const y = pt[1];
  const x1 = lineSegmentStart[0];
  const y1 = lineSegmentStart[1];
  const x2 = lineSegmentEnd[0];
  const y2 = lineSegmentEnd[1];
  const dxc = pt[0] - x1;
  const dyc = pt[1] - y1;
  const dxl = x2 - x1;
  const dyl = y2 - y1;
  const cross = dxc * dyl - dyc * dxl;
  if (epsilon !== null) {
    if (Math.abs(cross) > epsilon) {
      return false;
    }
  } else if (cross !== 0) {
    return false;
  }
  if (!excludeBoundary) {
    if (Math.abs(dxl) >= Math.abs(dyl)) {
      return dxl > 0 ? x1 <= x && x <= x2 : x2 <= x && x <= x1;
    }
    return dyl > 0 ? y1 <= y && y <= y2 : y2 <= y && y <= y1;
  } else if (excludeBoundary === "start") {
    if (Math.abs(dxl) >= Math.abs(dyl)) {
      return dxl > 0 ? x1 < x && x <= x2 : x2 <= x && x < x1;
    }
    return dyl > 0 ? y1 < y && y <= y2 : y2 <= y && y < y1;
  } else if (excludeBoundary === "end") {
    if (Math.abs(dxl) >= Math.abs(dyl)) {
      return dxl > 0 ? x1 <= x && x < x2 : x2 < x && x <= x1;
    }
    return dyl > 0 ? y1 <= y && y < y2 : y2 < y && y <= y1;
  } else if (excludeBoundary === "both") {
    if (Math.abs(dxl) >= Math.abs(dyl)) {
      return dxl > 0 ? x1 < x && x < x2 : x2 < x && x < x1;
    }
    return dyl > 0 ? y1 < y && y < y2 : y2 < y && y < y1;
  }
  return false;
}

export default booleanPointOnLine;
