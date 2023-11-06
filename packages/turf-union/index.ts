import polygonClipping from "polygon-clipping";
import { multiPolygon, polygon } from "@turf/helpers";
import { geomEach } from "@turf/meta";
import {
  FeatureCollection,
  Feature,
  Polygon,
  MultiPolygon,
  GeoJsonProperties,
} from "geojson";

/**
 * Takes input {@link (Multi)Polygon(s)} and returns a combined polygon. If the input polygons are not contiguous, this function returns a {@link MultiPolygon} feature.
 *
 * @name union
 * @param {Feature<Polygon|MultiPolygon>} polygon1 input Polygon features
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
 * var union = turf.union(turf.featureCollection([poly1, poly2]));
 *
 * //addToMap
 * var addToMap = [poly1, poly2, union];
 */
function union<P extends GeoJsonProperties = GeoJsonProperties>(
  features: FeatureCollection<Polygon | MultiPolygon>,
  options: { properties?: P } = {}
): Feature<Polygon | MultiPolygon, P> | null {
  const geoms: polygonClipping.Geom[] = [];
  geomEach(features, (geom) => {
    geoms.push(geom.coordinates as polygonClipping.Geom);
  });

  if (geoms.length < 2) {
    throw new Error("Must have at least 2 geometries");
  }

  const unioned = polygonClipping.union(geoms[0], ...geoms.slice(1));
  if (unioned.length === 0) return null;
  if (unioned.length === 1) return polygon(unioned[0], options.properties);
  else return multiPolygon(unioned, options.properties);
}

export default union;
