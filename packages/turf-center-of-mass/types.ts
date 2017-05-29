import {lineString} from '@turf/helpers'
import * as centerOfMass from './'

const line = lineString([[0, 0], [10, 10]]);

centerOfMass(line)
centerOfMass(line, {foo: 'bar'})
