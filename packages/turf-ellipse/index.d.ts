import { Feature, Polygon, GeoJsonProperties } from "geojson";
import { Coord, Units } from "@turf/helpers";

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
    properties?: GeoJsonProperties;
  }
): Feature<Polygon>;
