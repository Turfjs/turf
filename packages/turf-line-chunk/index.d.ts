import {
  LineString,
  MultiLineString,
  GeometryCollection,
  Feature,
  FeatureCollection,
} from "geojson";
import { Units } from "@turf/helpers";

/**
 * http://turfjs.org/docs/#lineChunk
 */
declare function lineChunk<T extends LineString | MultiLineString>(
  geojson:
    | Feature<T>
    | FeatureCollection<T>
    | T
    | GeometryCollection
    | Feature<GeometryCollection>,
  segmentLength: number,
  options?: {
    units?: Units;
    reverse?: boolean;
  }
): FeatureCollection<LineString>;

export { lineChunk };
export default lineChunk;
