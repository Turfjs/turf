import { Feature, FeatureCollection, BBox } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#bbox
 */
export default function bbox(
    features: Feature<any> | FeatureCollection<any>
): BBox;
