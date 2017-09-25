import {
    Point,
    MultiPolygon,
    FeatureCollection,
    Feature,
    Properties
} from '@turf/helpers'

interface Options {
    zProperty?: string;
    isobandProperties?: Properties[];
    commonProperties?: Properties;
}

/**
 * http://turfjs.org/docs/#isobands
 */
export default function isobands(
    points: FeatureCollection<Point>,
    breaks: number[],
    options?: Options
): FeatureCollection<MultiPolygon>;
