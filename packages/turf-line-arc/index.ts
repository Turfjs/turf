import { Feature, LineString } from "geojson";
import { circle } from "@turf/circle";
import { destination } from "@turf/destination";
import { Coord, lineString, Units } from "@turf/helpers";

/**
 * Creates a circular arc, of a circle of the given radius and center point, between bearing1 and bearing2;
 * 0 bearing is North of center point, positive clockwise.
 *
 * @function
 * @param {Coord} center center point
 * @param {number} radius radius of the circle
 * @param {number} bearing1 angle, in decimal degrees, of the first radius of the arc
 * @param {number} bearing2 angle, in decimal degrees, of the second radius of the arc
 * @param {Object} [options={}] Optional parameters
 * @param {number} [options.steps=64] number of steps (straight segments) that will constitute the arc
 * @param {Units} [options.units='kilometers'] Supports all valid Turf {@link https://turfjs.org/docs/api/types/Units Units}.
 * @returns {Feature<LineString>} line arc
 * @example
 * var center = turf.point([-75, 40]);
 * var radius = 5;
 * var bearing1 = 25;
 * var bearing2 = 47;
 *
 * var arc = turf.lineArc(center, radius, bearing1, bearing2);
 *
 * //addToMap
 * var addToMap = [center, arc]
 */
function lineArc(
  center: Coord,
  radius: number,
  bearing1: number,
  bearing2: number,
  options: {
    steps?: number;
    units?: Units;
  } = {}
): Feature<LineString> {
  // default params
  const steps = options.steps || 64;

  const angle1 = convertAngleTo360(bearing1);
  const angle2 = convertAngleTo360(bearing2);
  const properties =
    !Array.isArray(center) && center.type === "Feature"
      ? center.properties
      : {};

  // handle angle parameters
  if (angle1 === angle2) {
    return lineString(
      circle(center, radius, options).geometry.coordinates[0],
      properties
    );
  }
  const arcStartDegree = angle1;
  const arcEndDegree = angle1 < angle2 ? angle2 : angle2 + 360;

  const coordinates = [];
  // How many degrees we'll swing around between each step.
  const arcStep = (arcEndDegree - arcStartDegree) / steps;
  // Add coords to the list, increasing the angle from our start bearing by
  // arcStep degrees until we reach the end bearing. Iterate a fixed number of
  // times (steps + 1 vertices) rather than comparing an accumulated angle
  // against arcEndDegree: floating-point drift in arcStartDegree + i * arcStep
  // could make the final value exceed arcEndDegree (e.g. 29.000000000000004),
  // dropping the last vertex so the arc never reached bearing2. Pin the last
  // vertex to arcEndDegree so the arc always ends exactly on bearing2.
  for (let i = 0; i <= steps; i++) {
    const alpha = i === steps ? arcEndDegree : arcStartDegree + i * arcStep;
    coordinates.push(
      destination(center, radius, alpha, options).geometry.coordinates
    );
  }
  return lineString(coordinates, properties);
}

/**
 * Takes any angle in  degrees
 * and returns a valid angle between 0-360 degrees
 *
 * @private
 * @param {number} alpha angle between -180-180 degrees
 * @returns {number} angle between 0-360 degrees
 */
function convertAngleTo360(alpha: number) {
  let beta = alpha % 360;
  if (beta < 0) {
    beta += 360;
  }
  return beta;
}

export { lineArc };
export default lineArc;
