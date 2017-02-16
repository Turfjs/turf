import {BBox, Points, Units} from '@turf/helpers';

/**
 * http://turfjs.org/docs/#pointgrid
 */
declare function pointGrid(bbox: BBox, cellSize: number, units?: Units): Points;
declare namespace pointGrid { }
export = pointGrid;
