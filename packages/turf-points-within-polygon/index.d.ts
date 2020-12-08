import {
  Feature,
  FeatureCollection,
  Polygon,
  MultiPolygon,
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
  points: Feature<Point, P> | FeatureCollection<Point, P>,
  polygons: Feature<G> | FeatureCollection<G> | G
): FeatureCollection<Point, P>;
