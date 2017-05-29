import {lineString} from '@turf/helpers'
import * as centroid from './'

const line = lineString([[0, 0], [10, 10]]);

centroid(line)
centroid(line, {foo: 'bar'})
