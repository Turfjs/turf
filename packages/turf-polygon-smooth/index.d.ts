import { Feature, FeatureCollection, Polygon } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#polygonSmooth
 */
export default function <T extends Polygon >(
    polygon: Feature<T> | T
): FeatureCollection<Polygon>;
