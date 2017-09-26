/// <reference types="geojson" />

import {
    Point,
    Position,
    Feature,
    LineString,
    Units
} from '@turf/helpers';

/**
 * http://turfjs.org/docs/#linearc
 */
export default function lineArc(
    center: Feature<Point> | Point | Position,
    radius: number,
    bearing1: number,
    bearing2: number,
    steps?: number,
    units?: string
): LineString;
