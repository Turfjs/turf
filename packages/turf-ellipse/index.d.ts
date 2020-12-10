import { Feature, Coord, Polygon, Units, Properties } from "@turf/helpers";

/**
 * http://turfjs.org/docs/#ellipse
 */
export default function (
  center: Coord,
  xSemiAxis: number,
  ySemiAxis: number,
  options?: {
    steps?: number;
    units?: Units;
    properties?: Properties;
  }
): Feature<Polygon>;
