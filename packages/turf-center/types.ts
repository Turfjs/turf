import {lineString} from '@turf/helpers'
import center from './dist/js/index'

const line = lineString([[0, 0], [10, 10]]);

center(line)
center(line, {properties: {foo: 'bar'}})
