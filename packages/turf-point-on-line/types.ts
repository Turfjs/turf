import * as pointOnLine from './'
import {point, lineString, multiLineString} from '@turf/helpers'

const units = 'miles'
const pt = point([1.5, 1.5])
const line = lineString([[0, 0], [1, 1]])
const multiLine = multiLineString([[
  [0, 0], [1, 1],
  [2, 2], [0, 0]
]])

// All combinations of parameters
pointOnLine(line, pt)
pointOnLine(multiLine, pt)
pointOnLine(line.geometry, pt)
pointOnLine(multiLine.geometry, pt)
pointOnLine(line, pt, units)

// Output can be used as Input
const output = pointOnLine(line, pt)
pointOnLine(line, output)

// Extra properties being generated from module
output.properties.dist
output.properties.index
output.properties.location
