import { Feature, Coord, Polygon } from "@turf/helpers";

/**
 * http://turfjs.org/docs/#planepoint
 */
export default function planepoint(
  point: Coord,
  triangle: Feature<Polygon> | Polygon
): number;
