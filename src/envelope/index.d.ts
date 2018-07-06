import { Feature, AllGeoJSON, Polygon } from '../helpers'

/**
 * http://turfjs.org/docs/#envelope
 */
export default function envelope(
    features: AllGeoJSON
): Feature<Polygon>;
