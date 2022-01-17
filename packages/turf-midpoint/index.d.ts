import { Feature, Point } from "geojson";
import { Coord } from "@turf/helpers";

/**
 * http://turfjs.org/docs/#midpoint
 */
export default function midpoint(point1: Coord, point2: Coord): Feature<Point>;
