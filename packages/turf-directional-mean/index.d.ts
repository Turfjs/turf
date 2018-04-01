import { FeatureCollection, LineString, Feature } from '@turf/helpers';
/**
 * @name directionalMean
 * This module calculate the average angle of a set of lines, measuring the trend of it.
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
