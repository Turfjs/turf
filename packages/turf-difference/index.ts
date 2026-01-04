import { Polygon, MultiPolygon, Feature, FeatureCollection } from "geojson";
import { feature } from "@turf/helpers";
import { geomEach } from "@turf/meta";
import { Clipper64, ClipType, FillRule, PolyTree64 } from "clipper2-ts";
import {
  multiPolygonToPaths,
  polygonToPaths,
  polyTreeToGeoJSON,
} from "@turf/internal/clipper2";

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
  if (features.features.length < 2) {
    throw new Error("Must have at least 2 features");
  }

  const clipper = new Clipper64();

  geomEach(features, (geom, idx) => {
    if (geom.type === "MultiPolygon") {
      if (idx === 0) {
        clipper.addSubject(multiPolygonToPaths(geom.coordinates));
      } else {
        clipper.addClip(multiPolygonToPaths(geom.coordinates));
      }
    } else {
      if (idx === 0) {
        clipper.addSubject(polygonToPaths(geom.coordinates));
      } else {
        clipper.addClip(polygonToPaths(geom.coordinates));
      }
    }
  });

  const tree: PolyTree64 = new PolyTree64();
  clipper.execute(ClipType.Difference, FillRule.EvenOdd, tree);

  // Return the result as Polygon, MultiPolygon, or null as appropriate
  const geom = polyTreeToGeoJSON(tree);
  if (geom === null) return null;
  return feature(geom);
}

export { difference };
export default difference;
