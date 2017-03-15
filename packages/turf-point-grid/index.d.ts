import {BBox, Points, Units, Feature, Features} from '@turf/helpers';

/**
 * http://turfjs.org/docs/#pointgrid
 */
declare function pointGrid(bbox: BBox | Feature | Features, cellSize: number, units?: Units): Points;
declare namespace pointGrid { }
export = pointGrid;
