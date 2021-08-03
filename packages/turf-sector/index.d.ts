import { Feature, Polygon, Units, Coord, Properties } from "@turf/helpers";

/**
 * http://turfjs.org/docs/#sector
 */
export default function sector(
  center: Coord,
  radius: number,
  bearing1: number,
  bearing2: number,
  options?: {
    steps?: number;
    units?: Units;
    properties?: Properties;
  }
): Feature<Polygon>;
