import {Feature, FeatureCollection, Point} from '@turf/helpers';

/**
 * http://turfjs.org/docs/#pointonsurface
 */
export default function pointOnSurface(
    features: Feature<any> | FeatureCollection<any>
): Feature<Point>;
