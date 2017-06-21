import {Units, BBox, Polygons} from '@turf/helpers'

/**
 * http://turfjs.org/docs/#hexgrid
 */
declare function hexGrid(bbox: BBox, cellDiameter: number, units?: Units, triangles?: boolean): Polygons;
declare namespace hexGrid { }
export = hexGrid;
