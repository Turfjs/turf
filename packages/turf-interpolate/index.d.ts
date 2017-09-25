/// <reference types="geojson" />

import {
    Point,
    Units,
    FeatureCollection,
    Grid
} from '@turf/helpers';

/**
 * http://turfjs.org/docs/#interpolate
 */
export default function interpolate(
    points: FeatureCollection<Point>,
    cellSize: number,
    outputType: Grid,
    property?: string,
    units?: Units,
    weight?: number
): FeatureCollection<Point>;
