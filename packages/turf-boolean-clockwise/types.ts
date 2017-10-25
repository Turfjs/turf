import booleanClockwise from './'
import { lineString } from '@turf/helpers'

var line = lineString([[0, 0], [1, 1], [1, 0], [0, 0]]);

booleanClockwise(line)
booleanClockwise(line.geometry)
booleanClockwise(line.geometry.coordinates)
