import {point, lineString} from '@turf/helpers'
import * as clone from './'

const pt = point([0, 20])
const ptCloned: GeoJSON.Feature<GeoJSON.Point> = clone(pt)

const line = lineString([[0, 20], [10, 10]]).geometry
const lineCloned: GeoJSON.LineString = clone(line)
