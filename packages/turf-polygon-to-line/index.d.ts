import { Feature, FeatureCollection, LineString, MultiLineString, MultiPolygon, Polygon, Properties } from "@turf/helpers";
/**
 * Converts a {@link Polygon} to {@link LineString|(Multi)LineString} or {@link MultiPolygon} to a
 * {@link FeatureCollection} of {@link LineString|(Multi)LineString}.
 *
 * @name polygonToLine
 * @param {Feature<Polygon|MultiPolygon>} poly Feature to convert
 * @param {Object} [options={}] Optional parameters
 * @param {Object} [options.properties={}] translates GeoJSON properties to Feature
 * @returns {FeatureCollection|Feature<LineString|MultiLinestring>} converted (Multi)Polygon to (Multi)LineString
 * @example
 * var poly = turf.polygon([[[125, -30], [145, -30], [145, -20], [125, -20], [125, -30]]]);
 *
 * var line = turf.polygonToLine(poly);
 *
 * //addToMap
 * var addToMap = [line];
 */
export default function <G extends Polygon | MultiPolygon, P = Properties>(poly: Feature<G, P> | G, options?: {
    properties?: any;
}): Feature<LineString | MultiLineString, P> | FeatureCollection<LineString | MultiLineString, P>;
/**
 * @private
 */
export declare function polygonToLine<G extends Polygon, P = Properties>(poly: Feature<G, P> | G, options?: {
    properties?: any;
}): Feature<LineString | MultiLineString, P>;
/**
 * @private
 */
export declare function multiPolygonToLine<G extends MultiPolygon, P = Properties>(multiPoly: Feature<G, P> | G, options?: {
    properties?: P;
}): FeatureCollection<LineString | MultiLineString, P>;
/**
 * @private
 */
export declare function coordsToLine<P = Properties>(coords: number[][][], properties: P): Feature<LineString | MultiLineString, P>;
