import { Feature, Point } from "geojson";
import { bearing } from "@turf/bearing";
import { destination } from "@turf/destination";
import { distance } from "@turf/distance";
import { Coord } from "@turf/helpers";
import { getCoord } from "@turf/invariant";

/**
 * Takes two points and returns a point midway between them. The midpoint is
 * calculated geodesically, meaning the curvature of the earth is taken into
 * account.
 *
 * @function
 * @param {Coord} point1 first point
 * @param {Coord} point2 second point
 * @returns {Feature<Point>} a point midway between `pt1` and `pt2`
 * @example
 * const point1 = turf.point([144.834823, -37.771257]);
 * const point2 = turf.point([145.14244, -37.830937]);
 *
 * const midpoint = turf.midpoint(point1, point2);
 *
 * //addToMap
 * const addToMap = [point1, point2, midpoint];
 * midpoint.properties['marker-color'] = '#f00';
 */
function midpoint(point1: Coord, point2: Coord): Feature<Point> {
  const dist = distance(point1, point2);
  const heading = bearing(point1, point2);
  const midpoint = destination(point1, dist / 2, heading);

  // Interpolate altitude (z-coordinate) when both input points carry one.
  // destination() propagates only the origin's z unchanged; average them instead.
  const coord1 = getCoord(point1);
  const coord2 = getCoord(point2);
  if (coord1[2] !== undefined && coord2[2] !== undefined) {
    midpoint.geometry.coordinates[2] = (coord1[2] + coord2[2]) / 2;
  }

  return midpoint;
}

export { midpoint };
export default midpoint;
