import { Feature, Polygon } from "geojson";
import { Coord } from "@turf/helpers";

/**
 * http://turfjs.org/docs/#planepoint
 */
declare function planepoint(
  point: Coord,
  triangle: Feature<Polygon> | Polygon
): number;

export { planepoint };
export default planepoint;
