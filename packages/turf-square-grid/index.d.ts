import {Units, BBox, Polygons, Feature, Features} from '@turf/helpers'

/**
 * http://turfjs.org/docs/#squaregrid
 */
declare function squareGrid(bbox: BBox | Feature<any> | Features<any>, cellSize: number, units?: Units, completelyWithin?: boolean): Polygons;
declare namespace squareGrid { }
export = squareGrid;
