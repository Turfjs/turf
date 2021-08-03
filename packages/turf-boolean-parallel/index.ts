import cleanCoords from "@turf/clean-coords";
import lineSegment from "@turf/line-segment";
import rhumbBearing from "@turf/rhumb-bearing";
import {
  bearingToAzimuth,
  Feature,
  Geometry,
  LineString,
  Position,
} from "@turf/helpers";

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
function booleanParallel(
  line1: Feature<LineString> | LineString,
  line2: Feature<LineString> | LineString
): boolean {
  // validation
  if (!line1) throw new Error("line1 is required");
  if (!line2) throw new Error("line2 is required");
  var type1 = getType(line1, "line1");
  if (type1 !== "LineString") throw new Error("line1 must be a LineString");
  var type2 = getType(line2, "line2");
  if (type2 !== "LineString") throw new Error("line2 must be a LineString");

  var segments1 = lineSegment(cleanCoords(line1)).features;
  var segments2 = lineSegment(cleanCoords(line2)).features;

  for (var i = 0; i < segments1.length; i++) {
    var segment1 = segments1[i].geometry.coordinates;
    if (!segments2[i]) break;
    var segment2 = segments2[i].geometry.coordinates;
    if (!isParallel(segment1, segment2)) return false;
  }
  return true;
}

/**
 * Compares slopes and return result
 *
 * @private
 * @param {Geometry|Feature<LineString>} segment1 Geometry or Feature
 * @param {Geometry|Feature<LineString>} segment2 Geometry or Feature
 * @returns {boolean} if slopes are equal
 */
function isParallel(segment1: Position[], segment2: Position[]) {
  var slope1 = bearingToAzimuth(rhumbBearing(segment1[0], segment1[1]));
  var slope2 = bearingToAzimuth(rhumbBearing(segment2[0], segment2[1]));
  return slope1 === slope2;
}

/**
 * Returns Feature's type
 *
 * @private
 * @param {Geometry|Feature<any>} geojson Geometry or Feature
 * @param {string} name of the variable
 * @returns {string} Feature's type
 */
function getType(geojson: Geometry | Feature<any>, name: string) {
  if ((geojson as Feature).geometry && (geojson as Feature).geometry.type)
    return (geojson as Feature).geometry.type;
  if (geojson.type) return geojson.type; // if GeoJSON geometry
  throw new Error("Invalid GeoJSON object for " + name);
}

export default booleanParallel;
