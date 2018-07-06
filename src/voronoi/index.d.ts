import { FeatureCollection, BBox, Point, Polygon } from '../helpers';

/**
 * http://turfjs.org/docs/#voronoi
 */
export default function voronoi(
    points: FeatureCollection<Point>,
    bbox: BBox
): FeatureCollection<Polygon>;
