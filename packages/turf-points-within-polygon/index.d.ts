import {
  Feature,
  FeatureCollection,
  Polygon,
  MultiPolygon,
  MultiPoint,
  Point,
  GeoJsonProperties,
} from "geojson";

/**
 * http://turfjs.org/docs/#pointswithinpolygon
 */
export default function pointsWithinPolygon<
  F extends Point | MultiPoint,
  G extends Polygon | MultiPolygon,
  P extends GeoJsonProperties = GeoJsonProperties,
>(
  points: Feature<F, P> | FeatureCollection<F, P>,
  polygons: Feature<G> | FeatureCollection<G> | G
): FeatureCollection<F, P>;
