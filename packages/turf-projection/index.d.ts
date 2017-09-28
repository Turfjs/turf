import {
    Feature,
    FeatureCollection,
    GeometryObject,
    GeometryCollection
} from '@turf/helpers';

type Types = Feature<any> | FeatureCollection<any> | GeometryObject | GeometryCollection

/**
 * http://turfjs.org/docs/#toMercator
 */
export function toMercator<T extends Types>(
    geojson: T,
    options?: {
        mutate?: boolean
    }
): T;

/**
 * http://turfjs.org/docs/#toWgs84
 */
export function toWgs84<T extends Types>(
    geojson: T,
    options?: {
        mutate?: boolean
    }
): T;
