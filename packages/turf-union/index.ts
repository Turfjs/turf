import polygonClipping from "polygon-clipping";
import { getGeom } from "@turf/invariant";
import { multiPolygon, polygon } from "@turf/helpers";
import { Feature, Polygon, MultiPolygon, Properties } from "@turf/helpers";

/**
 * Takes two {@link (Multi)Polygon(s)} and returns a combined polygon. If the input polygons are not contiguous, this function returns a {@link MultiPolygon} feature.
 *
 * @name union
 * @param {Array<Feature<Polygon|MultiPolygon> | Polygon | MultiPolygon>} features Input features to be unioned
 * @param {Object} [options={}] Optional Parameters
 * @param {Object} [options.properties={}] Translate Properties to output Feature
 * @returns {Feature<(Polygon|MultiPolygon)>} a combined {@link Polygon} or {@link MultiPolygon} feature, or null if the inputs are empty
 * @example
 * var poly1 = turf.polygon([[
 *     [-82.574787, 35.594087],
 *     [-82.574787, 35.615581],
 *     [-82.545261, 35.615581],
 *     [-82.545261, 35.594087],
 *     [-82.574787, 35.594087]
 * ]], {"fill": "#0f0"});
 * var poly2 = turf.polygon([[
 *     [-82.560024, 35.585153],
 *     [-82.560024, 35.602602],
 *     [-82.52964, 35.602602],
 *     [-82.52964, 35.585153],
 *     [-82.560024, 35.585153]
 * ]], {"fill": "#00f"});
 *
 * var union = turf.union([poly1, poly2]);
 *
 * //addToMap
 * var addToMap = [poly1, poly2, union];
 */
function union<P = Properties>(
  features: (Feature<Polygon | MultiPolygon> | Polygon | MultiPolygon)[],
  options: { properties?: P } = {}
): Feature<Polygon | MultiPolygon, P> | null {
  if (features.length === 0) {
    return null;
  }

  const coordinates = features.map(
    (feature) => getGeom(feature).coordinates
  ) as polygonClipping.Geom[];

  const unioned = polygonClipping.union(
    coordinates[0],
    ...coordinates.slice(1)
  );
  if (unioned.length === 0) return null;
  if (unioned.length === 1) return polygon(unioned[0], options.properties);
  else return multiPolygon(unioned, options.properties);
}

export default union;
