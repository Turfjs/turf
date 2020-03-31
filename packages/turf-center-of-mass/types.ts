import {lineString} from '@turf/helpers'
import centerOfMass from './dist/js/index'

const line = lineString([[0, 0], [10, 10]]);

centerOfMass(line)
centerOfMass(line, {properties: {foo: 'bar'}})
