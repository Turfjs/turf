import { Feature, FeatureCollection, LineString, MultiLineString, MultiPolygon, Point, Polygon } from "@turf/helpers";
/**
 * Takes any LineString or Polygon GeoJSON and returns the intersecting point(s).
 *
 * @name lineIntersect
 * @param {GeoJSON} line1 any LineString or Polygon
 * @param {GeoJSON} line2 any LineString or Polygon
 * @returns {FeatureCollection<Point>} point(s) that intersect both
 * @example
 * var line1 = turf.lineString([[126, -11], [129, -21]]);
 * var line2 = turf.lineString([[123, -18], [131, -14]]);
 * var intersects = turf.lineIntersect(line1, line2);
 *
 * //addToMap
 * var addToMap = [line1, line2, intersects]
 */
declare function lineIntersect<G1 extends LineString | MultiLineString | Polygon | MultiPolygon, G2 extends LineString | MultiLineString | Polygon | MultiPolygon>(line1: FeatureCollection<G1> | Feature<G1> | G1, line2: FeatureCollection<G2> | Feature<G2> | G2): FeatureCollection<Point>;
export default lineIntersect;
