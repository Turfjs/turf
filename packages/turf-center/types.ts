import {lineString} from '@turf/helpers'
import center from './'

const line = lineString([[0, 0], [10, 10]]);

center(line)
center(line, {foo: 'bar'})
