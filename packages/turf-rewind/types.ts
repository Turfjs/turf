import {polygon, lineString, multiLineString, multiPolygon} from '@turf/helpers'
import * as rewind from './'

const coords = [[121, -29], [138, -29], [138, -18], [121, -18], [121, -29]]
const poly = polygon([coords])
const line = lineString(coords)
const multiPoly = multiPolygon([[coords], [coords]])
const multiLine = multiLineString([coords, coords])

rewind(line)
rewind(poly)
rewind(multiPoly)
rewind(multiLine)
rewind(poly, true)
rewind(poly, true, true)
