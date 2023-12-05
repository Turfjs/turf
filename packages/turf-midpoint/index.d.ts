import { Feature, Point } from "geojson";
import { Coord } from "@turf/helpers";

/**
 * http://turfjs.org/docs/#midpoint
 */
declare function midpoint(point1: Coord, point2: Coord): Feature<Point>;

export { midpoint };
export default midpoint;
