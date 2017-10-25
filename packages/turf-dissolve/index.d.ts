import { FeatureCollection, Polygon } from '@turf/helpers'

/**
 * http://turfjs.org/docs.html#dissolve
 */
export default function dissolve(
    featureCollection: FeatureCollection<Polygon>,
    options?: {
      propertyName?: string
    }
): FeatureCollection<Polygon>;
