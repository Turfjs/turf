import {
  Feature,
  GeoJsonProperties,
  MultiPolygon,
  Polygon,
  FeatureCollection,
} from "geojson";
import { multiPolygon, polygon } from "@turf/helpers";
import { geomEach } from "@turf/meta";
import polygonClipping from "polygon-clipping";

/**
 * Takes {@link Polygon|polygon} or {@link MultiPolygon|multi-polygon} geometries and
 * finds their polygonal intersection. If they don't intersect, returns null.
 *
 * @name intersect
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
export default function intersect<
  P extends GeoJsonProperties = GeoJsonProperties,
>(
  features: FeatureCollection<Polygon | MultiPolygon>,
  options: {
    properties?: P;
  } = {}
): Feature<Polygon | MultiPolygon, P> | null {
  const geoms: polygonClipping.Geom[] = [];

  geomEach(features, (geom) => {
    geoms.push(geom.coordinates as polygonClipping.Geom);
  });

  if (geoms.length < 2) {
    throw new Error("Must specify at least 2 geometries");
  }
  const intersection = polygonClipping.intersection(
    geoms[0],
    ...geoms.slice(1)
  );
  if (intersection.length === 0) return null;
  if (intersection.length === 1)
    return polygon(intersection[0], options.properties);
  return multiPolygon(intersection, options.properties);
}
