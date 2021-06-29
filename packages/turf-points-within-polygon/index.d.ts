import {
  Feature,
  FeatureCollection,
  Polygon,
  MultiPolygon,
  MultiPoint,
  Point,
  Properties,
} from "@turf/helpers";

/**
 * http://turfjs.org/docs/#pointswithinpolygon
 */
export default function pointsWithinPolygon<
  G extends Polygon | MultiPolygon,
  P = Properties
>(
  points:
    | Feature<Point | MultiPoint, P>
    | FeatureCollection<Point | MultiPoint, P>,
  polygons: Feature<G> | FeatureCollection<G> | G
): FeatureCollection<Point | MultiPoint, P>;
