import { Units, Feature, FeatureCollection, GeometryObject, GeometryCollection, FeatureGeometryCollection } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#linedistance
 */
export default function lineDistance(
    geojson: Feature<any> | FeatureCollection<any> | GeometryObject | GeometryCollection | FeatureGeometryCollection,
    options?: {
        units?: Units
    }
): number;
