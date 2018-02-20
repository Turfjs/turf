import { Feature, Geometry, Properties } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#cleancoords
 */
export default function <G extends Geometry, P = Properties>(
    feature: Feature<G, P>,
    options?: {
      mutate?: boolean
    }
): Feature<G, P>;

export default function <G extends Geometry>(
  feature: G,
  options?: {
    mutate?: boolean
  }
): G;

export default function <G extends Geometry>(
  feature: Feature<G> | G,
  options?: {
    mutate?: boolean
  }
): Feature<G> | G;
