import { LineString, Feature } from "geojson";
import { Units } from "@turf/helpers";

/**
 * http://turfjs.org/docs/
 */
export default function lineSliceAlong(
  line: Feature<LineString> | LineString,
  startDist: number,
  stopDist: number,
  options?: {
    units?: Units;
  }
): Feature<LineString>;
