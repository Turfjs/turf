import { point, lineString } from '@turf/helpers'
import pointToLineDistance from './'

const pt = point([0, 0])
const line = lineString([[1, 1],[-1, 1]])
const distance: number = pointToLineDistance(pt, line, {units: 'miles'})

pointToLineDistance(pt, line)
pointToLineDistance(pt, line, {units: 'miles'})
pointToLineDistance(pt, line, {units: 'miles', mercator: true})
