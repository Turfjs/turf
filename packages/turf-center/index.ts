import { BBox, Feature, GeoJsonProperties, Point } from "geojson";
import { bbox } from "@turf/bbox";
import { point, AllGeoJSON } from "@turf/helpers";

/**
 * Takes a {@link Feature} or {@link FeatureCollection} and returns the absolute center point of all features.
 *
 * @function
 * @param {GeoJSON} geojson GeoJSON to be centered
 * @param {Object} [options={}] Optional parameters
 * @param {GeoJsonProperties} [options.properties={}] Properties to set on returned feature
 * @param {BBox} [options.bbox={}] Bbox to set on returned feature
 * @param {string | number} [options.id={}] Id to set on returned feature
 * @returns {Feature<Point>} a Point feature at the absolute center point of all input features
 * @example
 * const features = turf.points([
 *   [-97.522259, 35.4691],
 *   [-97.502754, 35.463455],
 *   [-97.508269, 35.463245]
 * ]);
 *
 * const center = turf.center(features);
 *
 * //addToMap
 * const addToMap = [features, center]
 * center.properties['marker-size'] = 'large';
 * center.properties['marker-color'] = '#000';
 */
function center<P extends GeoJsonProperties = GeoJsonProperties>(
  geojson: AllGeoJSON,
  options: { properties?: P; bbox?: BBox; id?: string | number } = {}
): Feature<Point, P> {
  const ext = bbox(geojson);
  const x = (ext[0] + ext[2]) / 2;
  const y = (ext[1] + ext[3]) / 2;
  return point([x, y], options.properties, options);
}

export { center };
export default center;
