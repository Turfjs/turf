import { Polygon, Feature, FeatureCollection } from "geojson";

declare function simplepolygon(
  feature: Feature<Polygon>
): FeatureCollection<Polygon>;

export { simplepolygon };
export default simplepolygon;
