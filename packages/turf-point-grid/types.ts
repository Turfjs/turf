import { BBox } from '@turf/helpers';
import pointGrid from './';

const units = 'miles';
const cellSide = 50;
const bbox: BBox = [-95, 30, -85, 40];

pointGrid(bbox, cellSide);
pointGrid(bbox, cellSide, units);
pointGrid(bbox, cellSide, units, true);
pointGrid(bbox, cellSide, units, true, true);
