import {
  BBox,
  Feature,
  FeatureCollection,
  Geometry,
  GeoJsonProperties,
} from "geojson";

declare class RBush<G extends Geometry, P extends GeoJsonProperties> {
  insert(feature: Feature<G, P>): RBush<G, P>;
  load(features: FeatureCollection<G, P> | Feature<G, P>[]): RBush<G, P>;
  remove(
    feature: Feature<G, P>,
    equals?: (a: Feature<G, P>, b: Feature<G, P>) => boolean
  ): RBush<G, P>;
  clear(): RBush<G, P>;
  search(geojson: Feature | FeatureCollection | BBox): FeatureCollection<G, P>;
  all(): FeatureCollection<any>;
  collides(geosjon: Feature | FeatureCollection | BBox): boolean;
  toJSON(): any;
  fromJSON(data: any): RBush<G, P>;
}

/**
 * https://github.com/mourner/rbush
 */
declare function geojsonRbush<
  G extends Geometry = Geometry,
  P extends GeoJsonProperties = GeoJsonProperties,
>(maxEntries?: number): RBush<G, P>;

export { geojsonRbush };
export default geojsonRbush;
