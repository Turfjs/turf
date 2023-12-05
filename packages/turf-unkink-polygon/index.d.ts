import { Polygon, MultiPolygon, Feature, FeatureCollection } from "geojson";

/**
 * http://turfjs.org/docs/#unkink-polygon
 */
declare function unkinkPolygon<T extends Polygon | MultiPolygon>(
  geojson: Feature<T> | FeatureCollection<T> | T
): FeatureCollection<Polygon>;

export { unkinkPolygon };
export default unkinkPolygon;
