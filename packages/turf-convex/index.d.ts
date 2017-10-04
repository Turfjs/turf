import { Feature, AllGeoJSON, Polygon } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#convex
 */
export default function (
    geojson: AllGeoJSON
): Feature<Polygon>;
