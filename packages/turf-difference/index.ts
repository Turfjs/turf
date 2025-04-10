import { Polygon, MultiPolygon, Feature, FeatureCollection } from "geojson";
import * as polyclip from "polyclip-ts";
import { polygon, multiPolygon } from "@turf/helpers";
import { geomEach } from "@turf/meta";

/**
 * Finds the difference between multiple {@link Polygon|polygons} by clipping the subsequent polygon from the first.
 *
 * @function
 * @param {FeatureCollection<Polygon|MultiPolygon>} features input Polygon features
 * @returns {Feature<Polygon|MultiPolygon>|null} a Polygon or MultiPolygon feature showing the area of `polygon1` excluding the area of `polygon2` (if empty returns `null`)
 * @example
 * var polygon1 = turf.polygon([[
 *   [128, -26],
 *   [141, -26],
 *   [141, -21],
 *   [128, -21],
 *   [128, -26]
 * ]], {
 *   "fill": "#F00",
 *   "fill-opacity": 0.1
 * });
 * var polygon2 = turf.polygon([[
 *   [126, -28],
 *   [140, -28],
 *   [140, -20],
 *   [126, -20],
 *   [126, -28]
 * ]], {
 *   "fill": "#00F",
 *   "fill-opacity": 0.1
 * });
 *
 * var difference = turf.difference(turf.featureCollection([polygon1, polygon2]));
 *
 * //addToMap
 * var addToMap = [polygon1, polygon2, difference];
 */
function difference(
  features: FeatureCollection<Polygon | MultiPolygon>
): Feature<Polygon | MultiPolygon> | null {
  const geoms: Array<polyclip.Geom> = [];

  geomEach(features, (geom) => {
    geoms.push(geom.coordinates as polyclip.Geom);
  });

  if (geoms.length < 2) {
    throw new Error("Must have at least two features");
  }

  const properties = features.features[0].properties || {};

  const differenced = polyclip.difference(geoms[0], ...geoms.slice(1));
  if (differenced.length === 0) return null;
  if (differenced.length === 1) return polygon(differenced[0], properties);
  return multiPolygon(differenced, properties);
}

export { difference };
export default difference;
