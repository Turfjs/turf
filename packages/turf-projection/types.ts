import { toMercator, toWgs84 } from './'
import { point } from '@turf/helpers'

const pt = point([3, 51])
const projected = toMercator(pt)
const degrees = toWgs84(projected)
