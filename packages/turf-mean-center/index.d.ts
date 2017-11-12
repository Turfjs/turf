import { GeoJSON, Feature, Point } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#meancenter
 */
export default function (
    geojson: GeoJSON,
    weight?: string
): Feature<Point>;
