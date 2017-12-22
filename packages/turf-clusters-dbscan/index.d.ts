import { Units, FeatureCollection, Properties, Point, Feature } from '@turf/helpers';

export type Dbscan = 'core' | 'edge' | 'noise'
export interface DbscanProps extends Properties {
    dbscan?: Dbscan;
    cluster?: number;
}

/**
 * http://turfjs.org/docs/#clustersdbscans
 */
export default function (
    points: FeatureCollection<Point>,
    maxDistance: number,
    options?: {
        units?: Units,
        minPoints?: number,
        mutate?: boolean
    }
): FeatureCollection<Point, DbscanProps>;

