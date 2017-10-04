import { Feature, FeatureCollection, GeometryObject, GeometryCollection, FeatureGeometryCollection, Position} from '@turf/helpers';

/**
 * http://turfjs.org/docs/#toMercator
 */
export function toMercator<T extends Feature<any> | FeatureCollection<any> | GeometryObject | GeometryCollection>(
    geojson: T,
    options?: {
        mutate?: boolean
    }
): T;

/**
 * http://turfjs.org/docs/#toWgs84
 */
export function toWgs84<T extends Feature<any> | FeatureCollection<any> | GeometryObject | GeometryCollection>(
    geojson: T,
    options?: {
        mutate?: boolean
    }
): T;
