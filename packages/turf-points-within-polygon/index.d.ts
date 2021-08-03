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
  F extends Point | MultiPoint,
  G extends Polygon | MultiPolygon,
  P = Properties
>(
  points: Feature<F, P> | FeatureCollection<F, P>,
  polygons: Feature<G> | FeatureCollection<G> | G
): FeatureCollection<F, P>;
