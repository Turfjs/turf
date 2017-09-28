import { BBox } from '@turf/helpers';
import pointGrid from './';

const cellSide = 50;
const bbox: BBox = [-95, 30, -85, 40];

pointGrid(bbox, cellSide);
pointGrid(bbox, cellSide, {units: 'miles'});
pointGrid(bbox, cellSide, {units: 'miles', bboxIsMask: true});
pointGrid(bbox, cellSide, {units: 'miles', bboxIsMask: true, properties: {}});
