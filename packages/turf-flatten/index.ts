import { flattenEach } from "@turf/meta";
import { featureCollection } from "@turf/helpers";
import type { AllGeoJSON } from "@turf/helpers";
import type {
  Feature,
  Point,
  MultiPoint,
  LineString,
  MultiLineString,
  FeatureCollection,
  Polygon,
  MultiPolygon,
} from "geojson";

/**
 * Flattens any {@link GeoJSON} to a {@link FeatureCollection} inspired by [geojson-flatten](https://github.com/tmcw/geojson-flatten).
 *
 * @name flatten
 * @param {GeoJSON} geojson any valid GeoJSON Object
 * @returns {FeatureCollection<any>} all Multi-Geometries are flattened into single Features
 * @example
 * var multiGeometry = turf.multiPolygon([
 *   [[[102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0]]],
 *   [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]],
 *   [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]]
 * ]);
 *
 * var flatten = turf.flatten(multiGeometry);
 *
 * //addToMap
 * var addToMap = [flatten]
 */
function flatten<T extends Point | MultiPoint>(
  geojson: Feature<T> | FeatureCollection<T> | T
): FeatureCollection<Point>;

function flatten<T extends LineString | MultiLineString>(
  geojson: Feature<T> | FeatureCollection<T> | T
): FeatureCollection<LineString>;

function flatten<T extends Polygon | MultiPolygon>(
  geojson: Feature<T> | FeatureCollection<T> | T
): FeatureCollection<Polygon>;

function flatten(geojson: AllGeoJSON): FeatureCollection<any>;

function flatten(geojson: AllGeoJSON): FeatureCollection {
  if (!geojson) throw new Error("geojson is required");

  var results: Feature[] = [];
  flattenEach(geojson, function (feature) {
    results.push(feature);
  });
  return featureCollection(results);
}

export { flatten };
export default flatten;
