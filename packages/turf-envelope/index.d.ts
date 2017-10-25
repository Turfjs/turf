import { Feature, AllGeoJSON, Polygon } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#envelope
 */
export default function envelope(
    features: AllGeoJSON
): Feature<Polygon>;
