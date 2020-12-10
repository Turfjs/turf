import { FeatureCollection, GeometryObject } from "@turf/helpers";

/**
 * http://turfjs.org/docs/#sample
 */
export default function sample<T extends GeometryObject>(
  features: FeatureCollection<T>,
  num: number
): FeatureCollection<T>;
