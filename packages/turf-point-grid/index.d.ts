import {BBox, Points, Units, Feature, Features} from '@turf/helpers';

/**
 * http://turfjs.org/docs/#pointgrid
 */
declare function pointGrid(bbox: BBox | Feature<any> | Array<number>, cellSide: number, units?: Units, centered?: boolean, bboxIsMask?: boolean): Points;
declare namespace pointGrid { }
export = pointGrid;
