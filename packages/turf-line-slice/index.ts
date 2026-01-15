import { getCoords, getType } from "@turf/invariant";
import { Coord, lineString as linestring } from "@turf/helpers";
import { nearestPointOnLine } from "@turf/nearest-point-on-line";
import { Feature, LineString } from "geojson";

/**
 * Takes a {@link LineString|line}, a start {@link Point}, and a stop point
 * and returns a subsection of the line in-between those points.
 * The start & stop points don't need to fall exactly on the line.
 *
 * This can be useful for extracting only the part of a route between waypoints.
 *
 * @function
 * @param {Coord} startPt starting point
 * @param {Coord} stopPt stopping point
 * @param {Feature<LineString>|LineString} line line to slice
 * @returns {Feature<LineString>} sliced line
 * @example
 * var line = turf.lineString([
 *     [-77.031669, 38.878605],
 *     [-77.029609, 38.881946],
 *     [-77.020339, 38.884084],
 *     [-77.025661, 38.885821],
 *     [-77.021884, 38.889563],
 *     [-77.019824, 38.892368]
 * ]);
 * var start = turf.point([-77.029609, 38.881946]);
 * var stop = turf.point([-77.021884, 38.889563]);
 *
 * var sliced = turf.lineSlice(start, stop, line);
 *
 * //addToMap
 * var addToMap = [start, stop, line]
 */
function lineSlice(
  startPt: Coord,
  stopPt: Coord,
  line: Feature<LineString> | LineString
): Feature<LineString> {
  // Validation
  const coords = getCoords(line);
  if (getType(line) !== "LineString")
    throw new Error("line must be a LineString");

  const startVertex = nearestPointOnLine(line, startPt);
  const stopVertex = nearestPointOnLine(line, stopPt);
  const ends =
    startVertex.properties.segmentIndex <= stopVertex.properties.segmentIndex
      ? [startVertex, stopVertex]
      : [stopVertex, startVertex];
  const clipCoords = [ends[0].geometry.coordinates];
  for (
    let i = ends[0].properties.segmentIndex + 1;
    i < ends[1].properties.segmentIndex + 1;
    i++
  ) {
    clipCoords.push(coords[i]);
  }
  clipCoords.push(ends[1].geometry.coordinates);
  return linestring(clipCoords, line.type === "Feature" ? line.properties : {});
}

export { lineSlice };
export default lineSlice;
