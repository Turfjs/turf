import { Polygon, Feature, FeatureCollection, LineString } from "geojson";
import { Coord, Units } from "@turf/helpers";

/**
 * http://turfjs.org/docs/#shortestpath
 */
export default function shortestPath(
  start: Coord,
  end: Coord,
  options?: {
    obstacles?: Polygon | Feature<Polygon> | FeatureCollection<Polygon>;
    minDistance?: number;
    units?: Units;
    resolution?: number;
  }
): Feature<LineString>;
