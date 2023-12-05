import { FeatureCollection, BBox, Point, Polygon } from "geojson";

/**
 * http://turfjs.org/docs/#voronoi
 */
declare function voronoi(
  points: FeatureCollection<Point>,
  options?: { bbox: BBox }
): FeatureCollection<Polygon>;

export { voronoi };
export default voronoi;
