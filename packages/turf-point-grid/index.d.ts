import {BBox, Points, Units, Feature, Features} from '@turf/helpers';

/**
 * http://turfjs.org/docs/#pointgrid
 */
declare function pointGrid(bbox: BBox | Feature<any> | Features<any>, cellSize: number, units?: Units): Points;
declare namespace pointGrid { }
export = pointGrid;
