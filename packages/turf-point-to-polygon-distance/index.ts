import { booleanPointInPolygon } from "@turf/boolean-point-in-polygon";
import {
  Feature,
  Point,
  Polygon,
  MultiPolygon,
  LineString,
  Position,
} from "geojson";
import { pointToLineDistance } from "@turf/point-to-line-distance";
import { polygonToLine } from "@turf/polygon-to-line";
import { getGeom } from "@turf/invariant";
import { flattenEach } from "@turf/meta";
import { polygon, Units } from "@turf/helpers";

/**
 * Calculates the distance from a point to the edges of a polygon or multi-polygon.
 * Returns negative values for points inside the polygon.
 * Handles polygons with holes and multi-polygons.
 * A hole is treated as the exterior of the polygon.
 *
 * @param {Feature<Point> | Point | Position} point Input point
 * @param {Feature<Polygon | MultiPolygon> | Polygon | MultiPolygon} polygonOrMultiPolygon Input polygon or multipolygon
 * @param {Object} options Optional parameters
 * @param {Units} options.units Units of the result e.g. "kilometers", "miles", "meters"
 * @param {"geodesic" | "planar"} options.method Method of the result
 * @returns {number} Distance in meters (negative values for points inside the polygon)
 * @throws {Error} If input geometries are invalid
 */
export function pointToPolygonDistance(
  point: Feature<Point> | Point | Position,
  polygonOrMultiPolygon:
    | Feature<Polygon | MultiPolygon>
    | Polygon
    | MultiPolygon,
  options: {
    units?: Units;
    method?: "geodesic" | "planar";
  } = {}
): number {
  const method = options.method ?? "geodesic";
  const units = options.units ?? "kilometers";
  // Input validation
  if (!point) throw new Error("point is required");
  if (!polygonOrMultiPolygon)
    throw new Error("polygon or multi-polygon is required");

  const geom = getGeom(polygonOrMultiPolygon);

  if (geom.type === "MultiPolygon") {
    const distances = geom.coordinates.map((coords) =>
      pointToPolygonDistance(point, polygon(coords), { method, units })
    );
    return (
      Math.min(...distances.map(Math.abs)) *
      (booleanPointInPolygon(point, polygonOrMultiPolygon) ? -1 : 1)
    );
  }

  if (geom.coordinates.length > 1) {
    // Has holes
    const [exteriorDistance, ...interiorDistances] = geom.coordinates.map(
      (coords) =>
        pointToPolygonDistance(point, polygon([coords]), { method, units })
    );
    if (exteriorDistance >= 0) return exteriorDistance;
    // point is inside the exterior polygon shape
    const smallestInteriorDistance = Math.min(...interiorDistances);
    // point is inside one of the holes?
    if (smallestInteriorDistance < 0) return Math.abs(smallestInteriorDistance);
    // find which is closer, the distance to the hole or the distance to the edge of the exterior
    return Math.min(smallestInteriorDistance, Math.abs(exteriorDistance));
  }
  // The actual distance operation - on a normal, hole-less polygon in meters
  const lines = polygonToLine(geom);
  let minDistance = Infinity;
  flattenEach(lines, (feature) => {
    minDistance = Math.min(
      minDistance,
      pointToLineDistance(point, feature as Feature<LineString>, {
        method,
        units,
      })
    );
  });

  return booleanPointInPolygon(point, geom) ? -minDistance : minDistance;
}

export default pointToPolygonDistance;
