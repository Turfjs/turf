import {
  LineString,
  MultiLineString,
  Feature,
  GeoJsonProperties,
} from "geojson";
import { Coord } from "@turf/helpers";

/**
 * http://turfjs.org/docs/#greatcircle
 */
export default function greatCircle(
  start: Coord,
  end: Coord,
  options?: {
    properties?: GeoJsonProperties;
    npoints?: number;
    offset?: number;
  }
): Feature<LineString | MultiLineString>;
