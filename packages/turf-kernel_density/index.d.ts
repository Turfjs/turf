import { FeatureCollection, Point } from '@turf/helpers';

/**
 * http://turfjs.org/docs/#kerneldensity
 */

export default function (
    points: FeatureCollection<Point>,
    weight: Number
): FeatureCollection<Point>
