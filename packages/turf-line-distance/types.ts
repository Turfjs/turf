import {lineString} from '@turf/helpers'
import * as lineDistance from './'

var line = lineString([[115, -32], [131, -22], [143, -25], [150, -34]]);
var length = lineDistance(line, 'miles');

lineDistance(line, 'kilometers');
lineDistance(line);
