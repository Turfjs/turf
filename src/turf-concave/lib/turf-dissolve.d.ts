import { Feature, FeatureCollection, LineString, MultiLineString, MultiPolygon, Polygon } from "@turf/helpers";
/**
 * Transform function: attempts to dissolve geojson objects where possible
 * [GeoJSON] -> GeoJSON geometry
 *
 * @private
 * @param {FeatureCollection<LineString|MultiLineString|Polygon|MultiPolygon>} geojson Features to dissolved
 * @param {Object} [options={}] Optional parameters
 * @param {boolean} [options.mutate=false] Prevent input mutation
 * @returns {Feature<MultiLineString|MultiPolygon>} Dissolved Features
 */
declare function dissolve(geojson: FeatureCollection<LineString | MultiLineString | Polygon | MultiPolygon>, options?: {
    mutate?: boolean;
}): Feature<LineString | MultiLineString | Polygon | MultiPolygon> | null;
export default dissolve;
