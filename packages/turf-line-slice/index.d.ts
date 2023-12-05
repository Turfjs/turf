import { Feature, LineString } from "geojson";
import { Coord } from "@turf/helpers";

/**
 * http://turfjs.org/docs/#lineslice
 */
declare function lineSlice(
  startPt: Coord,
  stopPt: Coord,
  line: Feature<LineString> | LineString
): Feature<LineString>;

export { lineSlice };
export default lineSlice;
