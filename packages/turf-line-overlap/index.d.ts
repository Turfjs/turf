import { FeatureCollection, Feature, LineString, MultiLineString, Polygon, MultiPolygon } from '@turf/helpers';
/**
 * Takes any LineString or Polygon and returns the overlapping lines between both features.
 *
 * @name lineOverlap
 * @param {Geometry|Feature<LineString|MultiLineString|Polygon|MultiPolygon>} line1 any LineString or Polygon
 * @param {Geometry|Feature<LineString|MultiLineString|Polygon|MultiPolygon>} line2 any LineString or Polygon
 * @param {Object} [options={}] Optional parameters
 * @param {number} [options.tolerance=0] Tolerance distance to match overlapping line segments (in kilometers)
 * @returns {FeatureCollection<LineString>} lines(s) that are overlapping between both features
 * @example
 * var line1 = turf.lineString([[115, -35], [125, -30], [135, -30], [145, -35]]);
 * var line2 = turf.lineString([[115, -25], [125, -30], [135, -30], [145, -25]]);
 *
 * var overlapping = turf.lineOverlap(line1, line2);
 *
 * //addToMap
 * var addToMap = [line1, line2, overlapping]
 */
declare function lineOverlap<G1 extends LineString | MultiLineString | Polygon | MultiPolygon, G2 extends LineString | MultiLineString | Polygon | MultiPolygon>(line1: Feature<G1> | G1, line2: Feature<G2> | G2, options?: {
    tolerance?: number;
}): FeatureCollection<LineString>;
export default lineOverlap;
