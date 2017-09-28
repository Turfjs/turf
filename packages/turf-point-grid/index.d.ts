/// <reference types="geojson" />

import {
    Units,
    BBox,
    Feature,
    FeatureCollection,
    Point
} from '@turf/helpers';

interface Options {
    units?: Units,
    properties?: object,
    bboxIsMask?: boolean;
}

/**
 * http://turfjs.org/docs/#pointgrid
 */
export default function pointGrid(
    bbox: BBox | Feature<any> | FeatureCollection<any>,
    cellSide: number,
    options?: Options
): FeatureCollection<Point>;
