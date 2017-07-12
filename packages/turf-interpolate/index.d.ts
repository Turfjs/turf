/// <reference types="geojson" />

import * as helpers from '@turf/helpers';

/**
 * http://turfjs.org/docs/#interpolate
 */
declare function interpolate(
    points: interpolate.Points,
    cellSize: number,
    outputType: interpolate.OutputTypes,
    property?: string,
    units?: interpolate.Units,
    weight?: number): interpolate.Points;

declare namespace interpolate {
    type OutputTypes = 'point' | 'square' | 'hex' | 'triangle';
    type Points = helpers.Points;
    type Units = helpers.Units;
}
export = interpolate;
