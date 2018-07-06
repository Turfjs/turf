import { Feature, FeatureCollection, LineString } from "../helpers";
export interface DirectionalMeanLine extends Feature<LineString> {
    properties: {
        cartesianAngle: number;
        bearingAngle: number;
        circularVariance: number;
        averageX: number;
        averageY: number;
        averageLength: number;
        countOfLines: number;
        [key: string]: any;
    };
}
/**
 * @typedef {Object} DirectionalMeanLine
 * @property {number} cartesianAngle the mean angle of all lines. (measure from due earth counterclockwise).
 * @property {number} bearingAngle the mean angle of all lines. (bearing).
 * @property {number} circularVariance the extent to which features all point in the same direction.
 *  the value ranges 0-1, the bigger the value, the more variation in directions between lines.
 * @property {number} averageX the centroid of all lines.
 * @property {number} averageY the centroid of all line.
 * @property {number} averageLength the average length of line.
 * @property {number} countOfLines the count of features.
 */
/**
 * This module calculate the average angle of a set of lines, measuring the trend of it.
 * It can be used in both project coordinate system and geography coordinate system.
 * It can handle segments of line or the whole line.
 * @name directionalMean
 * @param {FeatureCollection<LineString>} lines
 * @param {object} [options={}]
 * @param {boolean} [options.planar=true] whether the spatial reference system is projected or geographical.
 * @param {boolean} [options.segment=false] whether treat a LineString as a whole or a set of segments.
 * @returns {DirectionalMeanLine} Directional Mean Line
 * @example
 *
 * var lines = turf.lineStrings([
 *   [[110, 45], [120, 50]],
 *   [[100, 50], [115, 55]],
 * ])
 * var directionalMeanLine = turf.directionalMean(lines);
 * // => directionalMeanLine
 */
export default function directionalMean(lines: FeatureCollection<LineString>, options?: {
    planar?: boolean;
    segment?: boolean;
}): DirectionalMeanLine;
