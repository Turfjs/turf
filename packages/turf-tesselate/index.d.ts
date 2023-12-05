import { Feature, FeatureCollection, Polygon } from "geojson";

/**
 * http://turfjs.org/docs/#tesselate
 */
declare function tesselate(
  polygon: Feature<Polygon>
): FeatureCollection<Polygon>;

export { tesselate };
export default tesselate;
