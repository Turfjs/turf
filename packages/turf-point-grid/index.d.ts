import {
    Units,
    BBox,
    Feature,
    FeatureCollection,
    Point
} from '@turf/helpers';

/**
 * http://turfjs.org/docs/#pointgrid
 */
export default function pointGrid(
    bbox: BBox | Feature<any> | FeatureCollection<any>,
    cellSide: number,
    options?: {
        units?: Units,
        properties?: object,
        bboxIsMask?: boolean;
    }
): FeatureCollection<Point>;
