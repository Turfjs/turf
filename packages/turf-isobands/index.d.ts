import { Point, MultiPolygon, FeatureCollection, Feature, Properties } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#isobands
 */
export default function isobands(
    points: FeatureCollection<Point>,
    breaks: number[],
    options?: {
        zProperty?: string;
        commonProperties?: Properties;
        breaksProperties?: Properties[];
    }
): FeatureCollection<MultiPolygon>;
