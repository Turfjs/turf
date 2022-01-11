import { FeatureCollection, BBox, Point, Polygon } from "geojson";

/**
 * http://turfjs.org/docs/#voronoi
 */
export default function voronoi(
  points: FeatureCollection<Point>,
  options?: { bbox: BBox }
): FeatureCollection<Polygon>;
