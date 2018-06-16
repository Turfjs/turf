import { Feature, FeatureCollection, LineString, MultiLineString, MultiPolygon, Point, Polygon } from "@turf/helpers";
/**
 * Takes a {@link LineString|linestring}, {@link MultiLineString|multi-linestring},
 * {@link MultiPolygon|multi-polygon} or {@link Polygon|polygon} and
 * returns {@link Point|points} at all self-intersections.
 *
 * @name kinks
 * @param {Feature<LineString|MultiLineString|MultiPolygon|Polygon>} featureIn input feature
 * @returns {FeatureCollection<Point>} self-intersections
 * @example
 * var poly = turf.polygon([[
 *   [-12.034835, 8.901183],
 *   [-12.060413, 8.899826],
 *   [-12.03638, 8.873199],
 *   [-12.059383, 8.871418],
 *   [-12.034835, 8.901183]
 * ]]);
 *
 * var kinks = turf.kinks(poly);
 *
 * //addToMap
 * var addToMap = [poly, kinks]
 */
export default function kinks<T extends LineString | MultiLineString | Polygon | MultiPolygon>(featureIn: Feature<T> | T): FeatureCollection<Point>;
