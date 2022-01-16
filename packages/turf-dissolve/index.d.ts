import { FeatureCollection, Polygon } from "geojson";

/**
 * http://turfjs.org/docs.html#dissolve
 */
export default function dissolve(
  featureCollection: FeatureCollection<Polygon>,
  options?: {
    propertyName?: string;
  }
): FeatureCollection<Polygon>;
