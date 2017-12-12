import { AllGeoJSON, Feature, Point, Properties } from '@turf/helpers';

/**
 * http://turfjs.org/docs/#centermean
 */
export default function (
    features: AllGeoJSON,
    options?: {
        properties?: Properties
        weight?: string
    }
): Feature<Point>;
