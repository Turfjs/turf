import { Corners, Coord, AllGeoJSON } from "@turf/helpers";

/**
 * http://turfjs.org/docs/#transformscale
 */
declare function transformScale<T extends AllGeoJSON>(
  geojson: T,
  factor: number,
  options?: {
    origin?: Corners | Coord;
    mutate?: boolean;
  }
): T;

export { transformScale };
export default transformScale;
