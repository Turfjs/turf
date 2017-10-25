import { Units, FeatureCollection, Point, Feature } from '@turf/helpers';

export type Dbscan = 'core' | 'edge' | 'noise'
export interface DbscanProps {
    dbscan?: Dbscan;
    cluster?: number;
    [key: string]: any;
}
export interface DbscanPoint extends Feature<Point> {
    properties: DbscanProps
}
export interface DbscanPoints {
    type: 'FeatureCollection'
    features: DbscanPoint[];
}

/**
 * http://turfjs.org/docs/#clustersdbscans
 */
export default function (
    points: FeatureCollection<Point>,
    maxDistance: number,
    options?: {
        units?: Units,
        minPoints?: number
    }
): DbscanPoints;

