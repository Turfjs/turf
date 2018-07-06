import { Feature, FeatureCollection, MultiPolygon, Polygon } from "@turf/helpers";
/**
 * Dissolves all overlapping (Multi)Polygon
 *
 * @param {FeatureCollection<Polygon|MultiPolygon>} geojson Polygons to dissolve
 * @param {Object} [options={}] Optional parameters
 * @param {boolean} [options.mutate=false] Prevent input mutation
 * @returns {Feature<Polygon|MultiPolygon>} Dissolved Polygons
 */
export default function polygonDissolve(geojson: FeatureCollection<Polygon | MultiPolygon>, options?: {
    mutate?: boolean;
}): Feature<Polygon | MultiPolygon> | null;
