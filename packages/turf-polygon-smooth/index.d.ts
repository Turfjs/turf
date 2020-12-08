import {
  Feature,
  FeatureCollection,
  Polygon,
  MultiPolygon,
} from "@turf/helpers";

/**
 * http://turfjs.org/docs/#polygonSmooth
 */
export default function <T extends Polygon | MultiPolygon>(
  polygon: FeatureCollection<T> | Feature<T> | T,
  options?: {
    iterations?: number;
  }
): FeatureCollection<T>;
