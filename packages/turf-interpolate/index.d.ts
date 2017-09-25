/// <reference types="geojson" />

import { Points, Units } from '@turf/helpers';

export type OutputTypes = 'point' | 'square' | 'hex' | 'triangle';

/**
 * http://turfjs.org/docs/#interpolate
 */
export default function interpolate(
    points: Points,
    cellSize: number,
    outputType: OutputTypes,
    property?: string,
    units?: Units,
    weight?: number): Points;
