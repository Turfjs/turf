/// <reference types="geojson" />

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
    units?: Units,
    centered?: boolean,
    bboxIsMask?: boolean
): FeatureCollection<Point>;
