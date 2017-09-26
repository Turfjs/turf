import { lineString } from '@turf/helpers'
import along from '.'

const line = lineString([[0, 0], [10, 10]]);

along(line, 5);
along(line, 5, {units: 'miles'});
