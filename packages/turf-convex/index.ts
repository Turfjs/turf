import { Feature, GeoJsonProperties, Polygon } from "geojson";
import { AllGeoJSON, polygon } from "@turf/helpers";
import { coordEach } from "@turf/meta";
import concaveman from "concaveman";

/**
 * Takes a {@link Feature} or a {@link FeatureCollection} and returns a convex hull {@link Polygon}.
 *
 * Internally this uses
 * the [convex-hull](https://github.com/mikolalysenko/convex-hull) module that implements a
 * [monotone chain hull](http://en.wikibooks.org/wiki/Algorithm_Implementation/Geometry/Convex_hull/Monotone_chain).
 *
 * @name convex
 * @param {GeoJSON} geojson input Feature or FeatureCollection
 * @param {Object} [options={}] Optional parameters
 * @param {number} [options.concavity=Infinity] 1 - thin shape. Infinity - convex hull.
 * @param {Object} [options.properties={}] Translate Properties to Feature
 * @returns {Feature<Polygon>} a convex hull
 * @example
 * var points = turf.featureCollection([
 *   turf.point([10.195312, 43.755225]),
 *   turf.point([10.404052, 43.8424511]),
 *   turf.point([10.579833, 43.659924]),
 *   turf.point([10.360107, 43.516688]),
 *   turf.point([10.14038, 43.588348]),
 *   turf.point([10.195312, 43.755225])
 * ]);
 *
 * var hull = turf.convex(points);
 *
 * //addToMap
 * var addToMap = [points, hull]
 */
export default function convex<P extends GeoJsonProperties = GeoJsonProperties>(
  geojson: AllGeoJSON,
  options: {
    concavity?: number;
    properties?: P;
  } = {}
): Feature<Polygon, P> | null {
  // Default parameters
  options.concavity = options.concavity || Infinity;

  // Container
  const points: number[][] = [];

  // Convert all points to flat 2D coordinate Array
  coordEach(geojson, (coord) => {
    points.push([coord[0], coord[1]]);
  });
  if (!points.length) {
    return null;
  }

  const convexHull = concaveman(points, options.concavity);

  // Convex hull should have at least 3 different vertices in order to create a valid polygon
  if (convexHull.length > 3) {
    return polygon([convexHull]);
  }
  return null;
}
