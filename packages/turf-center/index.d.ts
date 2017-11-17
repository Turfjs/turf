import { AllGeoJSON, Feature, Point, Properties } from '@turf/helpers';

/**
 * http://turfjs.org/docs/#center
 */
export default function (
    features: AllGeoJSON,
    options?: {
        properties?: Properties
        weight?: string
    }
): Feature<Point>;
