import {Units, BBox, Polygons} from '@turf/helpers'

/**
 * http://turfjs.org/docs/#trianglegrid
 */
declare function triangleGrid(bbox: BBox, cellSize: number, units?: Units): Polygons;
declare namespace triangleGrid { }
export = triangleGrid;
