import {
  Feature,
  Polygon,
  MultiPolygon,
  FeatureCollection,
} from "@turf/helpers";

/**
 * http://turfjs.org/docs/#mask
 */
export default function <T extends Polygon | MultiPolygon>(
  poly: Feature<T> | FeatureCollection<T> | T,
  mask?: Feature<Polygon> | Polygon
): Feature<Polygon>;
