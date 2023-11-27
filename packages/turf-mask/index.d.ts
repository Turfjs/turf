import { Feature, Polygon, MultiPolygon, FeatureCollection } from "geojson";

/**
 * http://turfjs.org/docs/#mask
 */
declare function mask<T extends Polygon | MultiPolygon>(
  poly: Feature<T> | FeatureCollection<T> | T,
  mask?: Feature<Polygon> | Polygon
): Feature<Polygon>;

export { mask };
export default mask;
