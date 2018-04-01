import { FeatureCollection, LineString, Feature } from '@turf/helpers';
/**
 *
 * This module calculate the average angle of a set of lines, measuring the trend of it.
 * It can be used in both project coordinate system and geography coordinate system.
 * It can handle segments of line or the whole line.
 * @name directionalMean
 * @param {FeatureCollection<LineString>} lines
 * @param {object} [options={}]
 * @param {boolean} [options.planar=true] whether the spatial reference system is projected or geographical.
 * @param {boolean} [options.segment=false] whether treat a LineString as a whole or a set of segments.
 * @returns {DirectionalMeanLine}
 * @example
 * const outGpsJsonPath1 = path.join(__dirname, 'test', 'out', 'bus_route_gps1.json');
 * let gpsResult1 = directionalMean(gpsGeojson, {
 *   planar: false
 *  });
 *
 */
export default function directionalMean(lines: FeatureCollection<LineString>, options?: {
    planar?: boolean;
    segment?: boolean;
}): DirectionalMeanLine;
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
