import { lineString } from '@turf/helpers'
import length from './'

var line = lineString([[115, -32], [131, -22], [143, -25], [150, -34]]);

length(line, {units: 'kilometers'});
length(line);
