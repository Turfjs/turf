import {
    LineString,
    MultiLineString,
    GeometryCollection,
    Units,
    Feature,
    FeatureCollection,
    FeatureGeometryCollection
} from '@turf/helpers'

/**
 * http://turfjs.org/docs/#linechunk
 */
export default function lineChunk<T extends LineString | MultiLineString>(
    geojson: Feature<T> | FeatureCollection<T> | T | GeometryCollection| FeatureGeometryCollection,
    segmentLength: number,
    options?: {
        units?: Units,
        reverse?: boolean
    }
): FeatureCollection<LineString>;
