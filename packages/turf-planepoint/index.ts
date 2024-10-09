import { Feature, Polygon } from "geojson";
import { getCoord, getGeom } from "@turf/invariant";
import { Coord } from "@turf/helpers";

/**
 * Takes a triangular plane as a polygon and a point within that triangle, and
 * returns the z-value at that point.
 *
 * The Polygon should have properties `a`, `b`, and `c`
 * that define the values at its three corners. Alternatively, the z-values
 * of each triangle point can be provided by their respective 3rd coordinate
 * if their values are not provided as properties.
 *
 * @function
 * @param {Coord} point the Point for which a z-value will be calculated
 * @param {Feature<Polygon>} triangle a Polygon feature with three vertices
 * @returns {number} the z-value for `interpolatedPoint`
 * @example
 * const point = turf.point([-75.3221, 39.529]);
 * // "a", "b", and "c" values represent the values of the coordinates in order.
 * const triangle = turf.polygon([[
 *   [-75.1221, 39.57],
 *   [-75.58, 39.18],
 *   [-75.97, 39.86],
 *   [-75.1221, 39.57]
 * ]], {
 *   "a": 11,
 *   "b": 122,
 *   "c": 44
 * });
 *
 * const zValue = turf.planepoint(point, triangle);
 * point.properties.zValue = zValue;
 *
 * //addToMap
 * const addToMap = [triangle, point];
 */
function planepoint(
  point: Coord,
  triangle: Feature<Polygon> | Polygon
): number {
  // Normalize input
  const coord = getCoord(point);
  const geom = getGeom(triangle);
  const coords = geom.coordinates;
  const outer = coords[0];
  if (outer.length < 4)
    throw new Error("OuterRing of a Polygon must have 4 or more Positions.");
  const properties = (triangle.type === "Feature" && triangle.properties) || {};
  const a = properties.a;
  const b = properties.b;
  const c = properties.c;

  // Planepoint
  const x = coord[0];
  const y = coord[1];
  const x1 = outer[0][0];
  const y1 = outer[0][1];
  const z1 = a !== undefined ? a : outer[0][2];
  const x2 = outer[1][0];
  const y2 = outer[1][1];
  const z2 = b !== undefined ? b : outer[1][2];
  const x3 = outer[2][0];
  const y3 = outer[2][1];
  const z3 = c !== undefined ? c : outer[2][2];
  const z =
    (z3 * (x - x1) * (y - y2) +
      z1 * (x - x2) * (y - y3) +
      z2 * (x - x3) * (y - y1) -
      z2 * (x - x1) * (y - y3) -
      z3 * (x - x2) * (y - y1) -
      z1 * (x - x3) * (y - y2)) /
    ((x - x1) * (y - y2) +
      (x - x2) * (y - y3) +
      (x - x3) * (y - y1) -
      (x - x1) * (y - y3) -
      (x - x2) * (y - y1) -
      (x - x3) * (y - y2));

  return z;
}

export { planepoint };
export default planepoint;
