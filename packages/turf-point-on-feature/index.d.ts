import {Feature, Point, FeatureCollection, GeometryObject} from '@turf/helpers';

/**
 * http://turfjs.org/docs/#pointonfeature
 */
export default function pointOnFeature(
    geojson: Feature<any> | FeatureCollection<any> | GeometryObject
): Feature<Point>;
