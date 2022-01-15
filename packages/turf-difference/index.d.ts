import { Polygon, MultiPolygon, Feature, FeatureCollection } from "geojson";

/**
 * http://turfjs.org/docs/#difference
 */
export default function difference(
  features: FeatureCollection<Polygon | MultiPolygon>
): Feature<Polygon | MultiPolygon> | null;
