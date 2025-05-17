import { Position } from "geojson";
import { feature } from "@turf/helpers";
import { getCoords, getType } from "@turf/invariant";
import { booleanPointOnLine } from "@turf/boolean-point-on-line";
import { lineString } from "@turf/helpers";

// To-Do => Improve Typescript GeoJSON handling

/**
 * Removes redundant coordinates from any GeoJSON Geometry.
 *
 * @function
 * @param {Geometry|Feature} geojson Feature or Geometry
 * @param {Object} [options={}] Optional parameters
 * @param {boolean} [options.mutate=false] allows GeoJSON input to be mutated
 * @returns {Geometry|Feature} the cleaned input Feature/Geometry
 * @example
 * var line = turf.lineString([[0, 0], [0, 2], [0, 5], [0, 8], [0, 8], [0, 10]]);
 * var multiPoint = turf.multiPoint([[0, 0], [0, 0], [2, 2]]);
 *
 * turf.cleanCoords(line).geometry.coordinates;
 * //= [[0, 0], [0, 10]]
 *
 * turf.cleanCoords(multiPoint).geometry.coordinates;
 * //= [[0, 0], [2, 2]]
 */
function cleanCoords(
  geojson: any,
  options: {
    mutate?: boolean;
  } = {}
) {
  // Backwards compatible with v4.0
  var mutate = typeof options === "object" ? options.mutate : options;
  if (!geojson) throw new Error("geojson is required");
  var type = getType(geojson);

  // Store new "clean" points in this Array
  var newCoords = [];

  switch (type) {
    case "LineString":
      newCoords = cleanLine(geojson, type);
      break;
    case "MultiLineString":
    case "Polygon":
      getCoords(geojson).forEach(function (line) {
        newCoords.push(cleanLine(line, type));
      });
      break;
    case "MultiPolygon":
      getCoords(geojson).forEach(function (polygons: any) {
        var polyPoints: Position[] = [];
        polygons.forEach(function (ring: Position[]) {
          polyPoints.push(cleanLine(ring, type));
        });
        newCoords.push(polyPoints);
      });
      break;
    case "Point":
      return geojson;
    case "MultiPoint":
      var existing: Record<string, true> = {};
      getCoords(geojson).forEach(function (coord: any) {
        var key = coord.join("-");
        if (!Object.prototype.hasOwnProperty.call(existing, key)) {
          newCoords.push(coord);
          existing[key] = true;
        }
      });
      break;
    default:
      throw new Error(type + " geometry not supported");
  }

  // Support input mutation
  if (geojson.coordinates) {
    if (mutate === true) {
      geojson.coordinates = newCoords;
      return geojson;
    }
    return { type: type, coordinates: newCoords };
  } else {
    if (mutate === true) {
      geojson.geometry.coordinates = newCoords;
      return geojson;
    }
    return feature({ type: type, coordinates: newCoords }, geojson.properties, {
      bbox: geojson.bbox,
      id: geojson.id,
    });
  }
}

/**
 * Clean Coords
 *
 * @private
 * @param {Array<number>|LineString} line Line
 * @param {string} type Type of geometry
 * @returns {Array<number>} Cleaned coordinates
 */
function cleanLine(line: Position[], type: string) {
  const points = getCoords(line);
  // handle "clean" segment
  if (points.length === 2 && !equals(points[0], points[1])) return points;

  const newPoints = [];

  // Segments based approach. With initial segment a-b, keep comparing to a
  // longer segment a-c and as long as b is still on a-c, b is a redundant
  // point.
  let a = 0,
    b = 1,
    c = 2;

  // Guaranteed we'll use the first point.
  newPoints.push(points[a]);
  // While there is still room to extend the segment ...
  while (c < points.length) {
    if (booleanPointOnLine(points[b], lineString([points[a], points[c]]))) {
      // b is on a-c, so we can discard point b, and extend a-b to be the same
      // as a-c as the basis for comparison during the next iteration.
      b = c;
    } else {
      // b is NOT on a-c, suggesting a-c is not an extension of a-b. Commit a-b
      // as a necessary segment.
      newPoints.push(points[b]);

      // Make our a-b for the next iteration start from the end of the segment
      // that was just locked in i.e. next a-b should be the current b-(b+1).
      a = b;
      b++;
      c = b;
    }
    // Plan to look at the next point during the next iteration.
    c++;
  }
  // No remaining points, so commit the current a-b segment.
  newPoints.push(points[b]);

  if (type === "Polygon" || type === "MultiPolygon") {
    // For polygons need to make sure the start / end point wasn't one of the
    // points that needed to be cleaned.
    // https://github.com/Turfjs/turf/issues/2406
    // For points [a, b, c, ..., z, a]
    // if a is on line b-z, it too can be removed. New array becomes
    // [b, c, ..., z, b]
    if (
      booleanPointOnLine(
        newPoints[0],
        lineString([newPoints[1], newPoints[newPoints.length - 2]])
      )
    ) {
      newPoints.shift(); // Discard starting point.
      newPoints.pop(); // Discard closing point.
      newPoints.push(newPoints[0]); // Duplicate the new closing point to end of array.
    }

    // (Multi)Polygons must have at least 4 points and be closed.
    if (newPoints.length < 4) {
      throw new Error("invalid polygon, fewer than 4 points");
    }
    if (!equals(newPoints[0], newPoints[newPoints.length - 1])) {
      throw new Error("invalid polygon, first and last points not equal");
    }
  }

  return newPoints;
}

/**
 * Compares two points and returns if they are equals
 *
 * @private
 * @param {Position} pt1 point
 * @param {Position} pt2 point
 * @returns {boolean} true if they are equals
 */
function equals(pt1: Position, pt2: Position) {
  return pt1[0] === pt2[0] && pt1[1] === pt2[1];
}

export { cleanCoords };
export default cleanCoords;
