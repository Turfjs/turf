/// <reference types="geojson" />

import { Units, BBox } from '@turf/helpers';

export type Feature = GeoJSON.Feature<any>;
export type FeatureCollection = GeoJSON.FeatureCollection<any>;
export type Points = GeoJSON.FeatureCollection<GeoJSON.Point>;
export { Units, BBox }

/**
 * http://turfjs.org/docs/#pointgrid
 */
export default function pointGrid(
    bbox: BBox | Feature | FeatureCollection,
    cellSide: number,
    units?: Units,
    centered?: boolean,
    bboxIsMask?: boolean): Points;
