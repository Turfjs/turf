import { feature } from "@turf/helpers";
import { geomEach } from "@turf/meta";
import {
  FeatureCollection,
  Feature,
  Polygon,
  MultiPolygon,
  GeoJsonProperties,
} from "geojson";
import { Clipper, FillRule, ClipType, PolyTree64, Paths64 } from "clipper2-ts";
import {
  multiPolygonToPaths,
  polygonToPaths,
  polyTreeToGeoJSON,
} from "@turf/internal/clipper2";

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
  let subject: Paths64;
  let clippers: Paths64[] = [];

  if (features.features.length < 2) {
    throw new Error("Must have at least 2 features");
  }

  geomEach(features, (geom, idx) => {
    if (geom.type === "MultiPolygon") {
      if (idx === 0) {
        subject = multiPolygonToPaths(geom.coordinates);
      } else {
        clippers.push(multiPolygonToPaths(geom.coordinates));
      }
    } else {
      if (idx === 0) {
        subject = polygonToPaths(geom.coordinates);
      } else {
        clippers.push(polygonToPaths(geom.coordinates));
      }
    }
  });

  subject = subject!;

  for (const clipper of clippers) {
    subject = Clipper.union(subject, clipper, FillRule.EvenOdd);
  }

  // Do one final conversion to PolyTree to better allow handing of holes when
  // constructing return Geojson.
  let tree: PolyTree64 = new PolyTree64();
  Clipper.booleanOpWithPolyTree(
    ClipType.Union,
    subject,
    [],
    tree,
    FillRule.EvenOdd
  );

  return feature(polyTreeToGeoJSON(tree), options.properties);
}

export { union };
export default union;
