import { lineString } from '@turf/helpers'
import lineDistance from './'

var line = lineString([[115, -32], [131, -22], [143, -25], [150, -34]]);
var length = lineDistance(line, {units: 'miles'});

lineDistance(line, {units: 'kilometers'});
lineDistance(line);
