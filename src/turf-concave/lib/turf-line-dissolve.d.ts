import { Feature, FeatureCollection, LineString, MultiLineString } from "@turf/helpers";
/**
 * Merges all connected (non-forking, non-junctioning) line strings into single lineStrings.
 * [LineString] -> LineString|MultiLineString
 *
 * @param {FeatureCollection<LineString|MultiLineString>} geojson Lines to dissolve
 * @param {Object} [options={}] Optional parameters
 * @param {boolean} [options.mutate=false] Prevent input mutation
 * @returns {Feature<LineString|MultiLineString>} Dissolved lines
 */
declare function lineDissolve(geojson: FeatureCollection<LineString | MultiLineString>, options?: {
    mutate?: boolean;
}): Feature<LineString | MultiLineString> | null;
export default lineDissolve;
