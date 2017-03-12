import {Units, BBox, Polygons} from '@turf/helpers'

/**
 * http://turfjs.org/docs/#squaregrid
 */
declare function squareGrid(bbox: BBox, cellSize: number, units?: Units, completelyWithin?: boolean): Polygons;
declare namespace squareGrid { }
export = squareGrid;
