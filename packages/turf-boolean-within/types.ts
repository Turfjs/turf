import * as helpers from '@turf/helpers'
import * as booleanWithin from './'

const pt = helpers.point([0, 0])
const line = helpers.lineString([[0, 0], [10, 10]])
booleanWithin(pt, line)