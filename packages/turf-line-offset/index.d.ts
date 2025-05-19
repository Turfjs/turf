import { Feature, LineString, MultiLineString } from "geojson";
import { Units } from "@turf/helpers";

/**
 * http://turfjs.org/docs/#lineoffset
 */
declare function lineOffset<T extends LineString | MultiLineString>(
  line: Feature<T> | T,
  distance: number,
  options?: {
    units?: Units;
  }
): Feature<T>;

export { lineOffset };
export default lineOffset;
