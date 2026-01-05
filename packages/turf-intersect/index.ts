import {
  Feature,
  GeoJsonProperties,
  MultiPolygon,
  Polygon,
  FeatureCollection,
} from "geojson";
import { feature } from "@turf/helpers";
import { geomEach } from "@turf/meta";
import { FillRule, ClipType, PolyTreeD, ClipperD } from "clipper2-ts";
import {
  DEFAULT_PRECISION,
  multiPolygonToPaths,
  polygonToPaths,
  polyTreeToGeoJSON,
} from "@turf/internal/clipper2";

/**
 * Takes {@link Polygon|polygon} or {@link MultiPolygon|multi-polygon} geometries and
 * finds their polygonal intersection. If they don't intersect, returns null.
 *
 * @function
 * @param {FeatureCollection<Polygon | MultiPolygon>} features the features to intersect
 * @param {Object} [options={}] Optional Parameters
 * @param {Object} [options.properties={}] Translate GeoJSON Properties to Feature
 * @returns {Feature|null} returns a feature representing the area they share (either a {@link Polygon} or
 * {@link MultiPolygon}). If they do not share any area, returns `null`.
 * @example
 * var poly1 = turf.polygon([[
 *   [-122.801742, 45.48565],
 *   [-122.801742, 45.60491],
 *   [-122.584762, 45.60491],
 *   [-122.584762, 45.48565],
 *   [-122.801742, 45.48565]
 * ]]);
 *
 * var poly2 = turf.polygon([[
 *   [-122.520217, 45.535693],
 *   [-122.64038, 45.553967],
 *   [-122.720031, 45.526554],
 *   [-122.669906, 45.507309],
 *   [-122.723464, 45.446643],
 *   [-122.532577, 45.408574],
 *   [-122.487258, 45.477466],
 *   [-122.520217, 45.535693]
 * ]]);
 *
 * var intersection = turf.intersect(turf.featureCollection([poly1, poly2]));
 *
 * //addToMap
 * var addToMap = [poly1, poly2, intersection];
 */
function intersect<P extends GeoJsonProperties = GeoJsonProperties>(
  features: FeatureCollection<Polygon | MultiPolygon>,
  options: {
    properties?: P;
  } = {}
): Feature<Polygon | MultiPolygon, P> | null {
  if (features.features.length < 2) {
    throw new Error("Must have at least 2 features");
  }

  const clipper = new ClipperD(DEFAULT_PRECISION);

  geomEach(features, (geom, idx) => {
    if (geom.type === "MultiPolygon") {
      if (idx === 0) {
        clipper.addSubjectPaths(multiPolygonToPaths(geom.coordinates));
      } else {
        clipper.addClipPaths(multiPolygonToPaths(geom.coordinates));
      }
    } else {
      if (idx === 0) {
        clipper.addSubjectPaths(polygonToPaths(geom.coordinates));
      } else {
        clipper.addClipPaths(polygonToPaths(geom.coordinates));
      }
    }
  });

  const tree = new PolyTreeD();
  clipper.execute(ClipType.Intersection, FillRule.EvenOdd, tree);

  // Return the result as Polygon, MultiPolygon, or null as appropriate
  const geom = polyTreeToGeoJSON(tree);
  if (geom === null) return null;
  return feature(geom, options.properties);
}

export { intersect };
export default intersect;
