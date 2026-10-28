import { bearing } from "@turf/bearing";
import { distance } from "@turf/distance";
import { destination } from "@turf/destination";
import { lineString, isObject, Units } from "@turf/helpers";
import { Feature, LineString, Point, Position } from "geojson";

/**
 * Takes a {@link LineString|line}, a specified distance along the line to a start {@link Point},
 * and a specified  distance along the line to a stop point
 * and returns a subsection of the line in-between those points.
 *
 * This can be useful for extracting only the part of a route between two distances.
 *
 * @function
 * @param {Feature<LineString>|LineString} line input line
 * @param {number} startDist distance along the line to starting point
 * @param {number} stopDist distance along the line to ending point
 * @param {Object} [options={}] Optional parameters
 * @param {Units} [options.units='kilometers'] Supports all valid Turf {@link https://turfjs.org/docs/api/types/Units Units}
 * @returns {Feature<LineString>} sliced line
 * @example
 * var line = turf.lineString([[7, 45], [9, 45], [14, 40], [14, 41]]);
 * var start = 12.5;
 * var stop = 25;
 * var sliced = turf.lineSliceAlong(line, start, stop, {units: 'miles'});
 *
 * //addToMap
 * var addToMap = [line, start, stop, sliced]
 */
function lineSliceAlong(
  line: Feature<LineString> | LineString,
  startDist: number,
  stopDist: number,
  options: { units?: Units } = {}
): Feature<LineString> {
  // Optional parameters
  if (!isObject(options)) throw new Error("options is invalid");
  const { units = "kilometers" } = options;

  var coords: Position[];
  var slice: Position[] = [];

  // Validation
  if (line.type === "Feature") coords = line.geometry.coordinates;
  else if (line.type === "LineString") coords = line.coordinates;
  else throw new Error("input must be a LineString Feature or Geometry");
  const origCoordsLength = coords.length;
  let travelled = 0;
  let overshot: number, direction: number, interpolated: Feature<Point>;
  for (let i = 0; i < coords.length; i++) {
    if (startDist >= travelled && i === coords.length - 1) break;
    else if (travelled > startDist && slice.length === 0) {
      let overshot = startDist - travelled;
      if (!overshot) {
        slice.push(coords[i]);
        return lineString(slice);
      }
      direction = bearing(coords[i], coords[i - 1]) - 180;
      interpolated = destination(coords[i], overshot, direction, { units });
      const startIntCoords = interpolated.geometry.coordinates;
      const startSegDist = distance(coords[i - 1], coords[i], { units });
      const startFrac =
        startSegDist > 0 ? 1 - Math.abs(overshot) / startSegDist : 0;
      setInterpolatedAltitude(
        startIntCoords,
        coords[i - 1],
        coords[i],
        startFrac
      );
      slice.push(startIntCoords);
    }

    if (travelled >= stopDist) {
      overshot = stopDist - travelled;
      if (!overshot) {
        slice.push(coords[i]);
        return lineString(slice);
      }
      direction = bearing(coords[i], coords[i - 1]) - 180;
      interpolated = destination(coords[i], overshot, direction, { units });
      const stopIntCoords = interpolated.geometry.coordinates;
      const stopSegDist = distance(coords[i - 1], coords[i], { units });
      const stopFrac =
        stopSegDist > 0 ? 1 - Math.abs(overshot) / stopSegDist : 0;
      setInterpolatedAltitude(
        stopIntCoords,
        coords[i - 1],
        coords[i],
        stopFrac
      );
      slice.push(stopIntCoords);
      return lineString(slice);
    }

    if (travelled >= startDist) {
      slice.push(coords[i]);
    }

    if (i === coords.length - 1) {
      return lineString(slice);
    }

    travelled += distance(coords[i], coords[i + 1], { units });
  }

  if (travelled < startDist && coords.length === origCoordsLength)
    throw new Error("Start position is beyond line");

  var last = coords[coords.length - 1];
  return lineString([last, last]);
}
/**
 * Assign an interpolated altitude to a coordinate produced by destination().
 *
 * When both segment endpoints carry an altitude the value is linearly
 * interpolated at `fraction` (0 = at `from`, 1 = at `to`).  If either
 * endpoint has no altitude, any altitude that destination() may have copied
 * from its origin is removed so the output remains 2-D.
 */
function setInterpolatedAltitude(
  coord: Position,
  from: Position,
  to: Position,
  fraction: number
): void {
  if (from[2] !== undefined && to[2] !== undefined) {
    coord[2] = from[2] + fraction * (to[2] - from[2]);
  } else {
    coord.splice(2);
  }
}

export { lineSliceAlong };
export default lineSliceAlong;
