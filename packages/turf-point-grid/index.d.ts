import { Units, BBox, AllGeoJSON, FeatureCollection, Point, Properties } from '@turf/helpers';

/**
 * http://turfjs.org/docs/#pointgrid
 */
export default function pointGrid(
    bbox: BBox | AllGeoJSON,
    cellSide: number,
    options?: {
        units?: Units,
        properties?: Properties,
        bboxIsMask?: boolean;
    }
): FeatureCollection<Point>;
