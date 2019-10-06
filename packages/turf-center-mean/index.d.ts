import { Feature, Point, Properties, BBox, Id } from '@turf/helpers';
/**
 * Takes a {@link Feature} or {@link FeatureCollection} and returns the mean center. Can be weighted.
 *
 * @name centerMean
 * @param {GeoJSON} geojson GeoJSON to be centered
 * @param {Object} [options={}] Optional parameters
 * @param {Object} [options.properties={}] Translate GeoJSON Properties to Point
 * @param {Object} [options.bbox={}] Translate GeoJSON BBox to Point
 * @param {Object} [options.id={}] Translate GeoJSON Id to Point
 * @param {string} [options.weight] the property name used to weight the center
 * @returns {Feature<Point>} a Point feature at the mean center point of all input features
 * @example
 * var features = turf.featureCollection([
 *   turf.point([-97.522259, 35.4691], {value: 10}),
 *   turf.point([-97.502754, 35.463455], {value: 3}),
 *   turf.point([-97.508269, 35.463245], {value: 5})
 * ]);
 *
 * var options = {weight: "value"}
 * var mean = turf.centerMean(features, options);
 *
 * //addToMap
 * var addToMap = [features, mean]
 * mean.properties['marker-size'] = 'large';
 * mean.properties['marker-color'] = '#000';
 */
declare function centerMean<P = Properties>(geojson: any, options?: {
    properties?: P;
    bbox?: BBox;
    id?: Id;
    weight?: string;
}): Feature<Point, P>;
export default centerMean;
