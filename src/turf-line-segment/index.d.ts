import { Feature, FeatureCollection, LineString, MultiLineString, MultiPolygon, Polygon } from "@turf/helpers";
/**
 * Creates a {@link FeatureCollection} of 2-vertex {@link LineString} segments from a
 * {@link LineString|(Multi)LineString} or {@link Polygon|(Multi)Polygon}.
 *
 * @name lineSegment
 * @param {GeoJSON} geojson GeoJSON Polygon or LineString
 * @returns {FeatureCollection<LineString>} 2-vertex line segments
 * @example
 * var polygon = turf.polygon([[[-50, 5], [-40, -10], [-50, -10], [-40, 5], [-50, 5]]]);
 * var segments = turf.lineSegment(polygon);
 *
 * //addToMap
 * var addToMap = [polygon, segments]
 */
declare function lineSegment<G extends LineString | MultiLineString | Polygon | MultiPolygon>(geojson: Feature<G> | FeatureCollection<G> | G): FeatureCollection<LineString>;
export default lineSegment;
