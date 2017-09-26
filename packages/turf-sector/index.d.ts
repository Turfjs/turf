/// <reference types="geojson" />

import {
    Point,
    Position,
    Feature,
    Polygon,
    Units
} from '@turf/helpers';

/**
 * http://turfjs.org/docs/#sector
 */
export default function sector(
    center: Feature<Point> | Point | Position,
    radius: number,
    bearing1: number,
    bearing2: number,
    steps?: number,
    units?: Units
): Feature<Polygon>;
