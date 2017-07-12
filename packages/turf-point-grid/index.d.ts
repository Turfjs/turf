/// <reference types="geojson" />

import * as helpers from '@turf/helpers';

/**
 * http://turfjs.org/docs/#pointgrid
 */
declare function pointGrid(
    bbox: pointGrid.BBox | pointGrid.Feature | pointGrid.FeatureCollection,
    cellSide: number,
    units?: pointGrid.Units,
    centered?: boolean,
    bboxIsMask?: boolean): pointGrid.Points;

declare namespace pointGrid {
    type Feature = GeoJSON.Feature<any>;
    type FeatureCollection = GeoJSON.FeatureCollection<any>;
    type Units = helpers.Units;
    type Points = GeoJSON.FeatureCollection<GeoJSON.Point>;
    type BBox = helpers.BBox;
}
export = pointGrid;
