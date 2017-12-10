import { Feature, Point, AllGeoJSON } from '@turf/helpers';

/**
 * http://turfjs.org/docs/#pointonfeature
 */
export default function pointOnFeature(
    geojson: AllGeoJSON
): Feature<Point>;
