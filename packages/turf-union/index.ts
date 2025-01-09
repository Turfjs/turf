import * as polyclip from "polyclip-ts";
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
 * Takes a collection of input polygons and returns a combined polygon. If the
 * input polygons are not contiguous, this function returns a multi-polygon
 * feature.
 *
 * @function
 * @param {FeatureCollection<Polygon|MultiPolygon>} features input polygon features
 * @param {Object} [options={}] Optional Parameters
 * @param {GeoJsonProperties} [options.properties={}] properties to assign to output feature
 * @returns {Feature<(Polygon|MultiPolygon)>|null} a combined polygon or multi-polygon feature, or null if there were no input polygons to combine
 * @example
 *
 * const poly1 = turf.polygon(
 *   [
 *     [
 *       [-82.574787, 35.594087],
 *       [-82.574787, 35.615581],
 *       [-82.545261, 35.615581],
 *       [-82.545261, 35.594087],
 *       [-82.574787, 35.594087],
 *     ],
 *   ],
 *   { fill: "#0f0" }
 * );
 *
 * const poly2 = turf.polygon(
 *   [
 *     [
 *       [-82.560024, 35.585153],
 *       [-82.560024, 35.602602],
 *       [-82.52964, 35.602602],
 *       [-82.52964, 35.585153],
 *       [-82.560024, 35.585153],
 *     ],
 *   ],
 * );
 *
 * const union = turf.union(turf.featureCollection([poly1, poly2]));
 *
 * //addToMap
 * const addToMap = { poly1, poly2, union };
 *
 * poly1.properties.fill = "#0f0";
 * poly2.properties.fill = "#00f";
 * union.properties.stroke = "red";
 * union.properties["stroke-width"] = 4;
 * union.properties.fill = "transparent";
 */
function union<P extends GeoJsonProperties = GeoJsonProperties>(
  features: FeatureCollection<Polygon | MultiPolygon>,
  options: { properties?: P } = {}
): Feature<Polygon | MultiPolygon, P> | null {
  const geoms: polyclip.Geom[] = [];
  geomEach(features, (geom) => {
    geoms.push(geom.coordinates as polyclip.Geom);
  });

  if (geoms.length < 2) {
    throw new Error("Must have at least 2 geometries");
  }

  const unioned = polyclip.union(geoms[0], ...geoms.slice(1));
  if (unioned.length === 0) return null;
  if (unioned.length === 1) return polygon(unioned[0], options.properties);
  else return multiPolygon(unioned, options.properties);
}

export { union };
export default union;
