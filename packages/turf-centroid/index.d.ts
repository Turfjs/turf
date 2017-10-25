import { AllGeoJSON, Feature, Point, Properties } from '@turf/helpers';

/**
 * http://turfjs.org/docs/#centroid
 */
export default function (
    features: AllGeoJSON,
    properties?: Properties
): Feature<Point>;
