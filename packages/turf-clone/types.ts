import {point, lineString, Feature, Point, LineString} from '@turf/helpers'
import clone from './'

const pt = point([0, 20])
const ptCloned: Feature<Point> = clone(pt)

const line = lineString([[0, 20], [10, 10]]).geometry
const lineCloned: LineString = clone(line)
